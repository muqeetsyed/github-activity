import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("git-hub activity: ", async (userInput) => {
    console.error("loading....");
        await gitUserActivity(userInput);
    rl.close();
});


async function gitUserActivity(userName) {
    const promise = await fetch(`https://api.github.com/users/${userName}/events`);
    const results = await promise.json();

    let PushTypeDetails = {'pushType': []};
    results.forEach((result) => {
        if (result.type === 'PushEvent') {
            const commitCount = result.payload.commits.length;
            const repo = result.repo.name;

            const existingRepo = PushTypeDetails.pushType.find(commit => commit.repo === repo)

            if (existingRepo !== undefined) {
                existingRepo.commitCount += commitCount;
            } else {
                PushTypeDetails.pushType.push({
                    repo: repo,
                    commitCount: commitCount,
                    type: result.type
                })
            }
        }
        else if (result.type === 'IssuesCommentEvent' && result.payload.action === 'opened') {
            console.log(`Opened a new issue in ${result.repo.name}`);
        }
        else if (result.type === 'CreateEvent') {
            console.warn(`Created ${result.repo.name} on ${result.created_at}`);
        }else if (result.type === 'DeleteEvent') {
            console.error(`Deleted ${result.repo.name} on ${result.created_at}`);
        }else if (result.type === 'PullRequestEvent') {
            console.log(`Pulled ${result.repo.name} on ${result.created_at}`);
        }
    })

    PushTypeDetails.pushType.forEach((commitsPushed) => {
        console.info(`There are total of ${commitsPushed.commitCount} commit(s) pushed to ${commitsPushed.repo} repository.`)
    })
}