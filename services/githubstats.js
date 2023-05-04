const axios = require("axios");
const axiosRetry = require("axios-retry");
const { GITHUB_TOKEN } = process.env;

//This is github api with a base URL and authorization header
const githubApi = axios.create({
    baseURL: "https://api.github.com",
    headers: {
        Authorization: `token${GITHUB_TOKEN}`,
    },
});

// Configure axios-retry
axiosRetry(githubApi, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      // Retry if the error code is one of these
      const retryErrorCodes = [408, 500, 502, 503, 504];
      const rateLimitErrorCode = 429;
      return (
        error.response &&
        (retryErrorCodes.includes(error.response.status) ||
          error.response.status === rateLimitErrorCode)
      );
    },
  });

//function to get the new contributors from the github api, it takes the organization, repository and since date as parameters
async function getNewContributors(org, repo, since) {
    try {
        const response = await githubApi.get(
        `/repos/${org}/${repo}/commits?since=${since.toISOString()}`
        );
        const commits = response.data;
        //getting the unique authors from all of the commits of the repository
        const newContributors = new Set();
        for (const commit of commits) {
        const author = commit.author?.login;
        if (author && !newContributors.has(author)) {
            newContributors.add(author);
        }
        }
        console.log("Total new contributors of this repo are : ", newContributors.size);
        return newContributors.size;
    } catch (error) {
        console.error(`Error fetching new contributors from github: ${error.message}`);
        return 0;
    }
}

module.exports = { getNewContributors };
