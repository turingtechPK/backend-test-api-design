let fetch;
let isSetupComplete = false;


const fetchWithRetry = async (url, options = {}, retries = 3, retryDelay = 2000) => {
    if (!isSetupComplete) {
        throw new Error('Module is not set up yet');
    }
    try {
        const response = await fetch(url, options);
        if (!response.ok && retries > 0 && response.status === 403) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return fetchWithRetry(url, options, retries - 1, retryDelay);
        }
        return response;
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            return fetchWithRetry(url, options, retries - 1, retryDelay);
        }
        throw error;
    }
};
const fetchNewContributorsFromGithub = async (org, repo, year, month = 0) => {
    if (!isSetupComplete) {
        throw new Error('Module is not set up yet');
    }
    try {
        const sinceDate = new Date(year, month, 1);
        const contributorsResponse = await fetchWithRetry(`https://api.github.com/repos/${org}/${repo}/contributors`, {
            headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
        });
        const contributors = await contributorsResponse.json();

        const commitPromises = contributors.map(contributor =>
            fetchWithRetry(`https://api.github.com/repos/${org}/${repo}/commits?author=${contributor.login}`, {
                headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
            }).then(response => response.json().then(data => ({ data, author: contributor.login })))
        );

        const commitsResponses = await Promise.all(commitPromises);
        const newContributorsList = commitsResponses
            .filter(response => response.data.length > 0)
            .map(response => {
                const firstCommitDate = new Date(response.data[response.data.length - 1].commit.committer.date);
                return firstCommitDate >= sinceDate ? response.author : null;
            })
            .filter(login => login !== null);

        return newContributorsList;
    } catch (error) {
        console.error('Error fetching contributors from GitHub:', error);
        return [];
    }
};

(async () => {
    fetch = (await import('node-fetch')).default;
    isSetupComplete = true;
})();

module.exports = {
    fetchNewContributorsFromGithub,
    fetchWithRetry
};
