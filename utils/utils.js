const axios = require('axios');
const axiosRetry = require('axios-retry');

// Set up the GitHub API client
const githubClient = axios.create({
    baseURL: 'https://api.github.com',
    headers: { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` }
});

// Apply the retry configuration to the GitHub client
axiosRetry(githubClient, {
    retries: 3,
    retryDelay: retryCount => retryCount * 2000,
    retryCondition: error => {
        return error.response?.status === 403 && error.response.data.message.includes('API rate limit exceeded');
    }
});

axiosRateLimit(githubClient, {
    maxRequests: 10,
    perMilliseconds: 1000,
    maxRPS: 10
});

/**
 * Validates the input parameters for organization, repository, and year.
 * 
 * @param {string} org - The GitHub organization name.
 * @param {string} repository - The GitHub repository name.
 * @param {number} year - The year for which contributors are to be fetched.
 * @returns {boolean} - Returns true if parameters are valid, false otherwise.
 */
const validateInputParameters = (org, repository, year) => {
    const currentYear = new Date().getFullYear();
    return typeof org === 'string' && 
           typeof repository === 'string' && 
           Number.isInteger(year) && 
           year <= currentYear;
};

/**
 * Fetches new contributors from GitHub.
 * 
 * @param {string} org - The GitHub organization name.
 * @param {string} repo - The GitHub repository name.
 * @param {number} year - The year for which contributors are to be fetched.
 * @returns {Promise<string[]>} - A promise that resolves to an array of new contributor usernames.
 */
const fetchNewContributorsFromGithub = async (org, repo, year) => {
    try {
        const sinceDate = new Date(year, 0, 1);
        const contributorsResponse = await githubClient.get(`/repos/${org}/${repo}/contributors`);
        const contributors = contributorsResponse.data;

        const commitPromises = contributors.map(contributor =>
            githubClient.get(`/repos/${org}/${repo}/commits`, { params: { author: contributor.login } })
        );

        const commitsResponses = await Promise.all(commitPromises);

        const newContributorsList = commitsResponses
            .filter(response => response.data.length > 0)
            .map(response => {
                const firstCommitDate = new Date(response.data[response.data.length - 1].commit.committer.date);
                return firstCommitDate >= sinceDate ? response.config.params.author : null;
            })
            .filter(login => login !== null);

        return newContributorsList;
    } catch (error) {
        console.error('Error fetching contributors from GitHub:', error);
        return [];
    }
};

module.exports = {
    validateInputParameters,
    fetchNewContributorsFromGithub
};