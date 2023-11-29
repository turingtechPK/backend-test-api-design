const axios = require('axios');
const Contributor = require('../models/Contributor');
const rateLimit = require('axios-rate-limit');
const { default: axiosRetry } = require('axios-retry');
const githubApi = rateLimit(axios.create({
    baseURL: 'https://api.github.com',
    headers: { 'Authorization': `token ${process.env.GITHUB_TOKEN}` }
  }),{
    maxRequests: 10, 
    perMilliseconds: 1000, 
    maxRPS: 10 
  });
  axiosRetry(githubApi, {
    retries: 3, 
    retryDelay: retryCount => retryCount * 2000, 
    retryCondition: error => {
    
      const isRateLimitError = error.response?.status === 403 && error.response.data.message.includes('API rate limit exceeded');
      
      return isRateLimitError;
    }
  });
  async function fetchRepositories(org) {
    try {
      const response = await githubApi.get(`/orgs/${org}/repos`);
      return response.data; // Array of repositories
    } catch (error) {
      console.error('Error fetching repositories:', error);
      return [];
    }
  }
  async function fetchContributors(org, repo) {
    try {
      const response = await githubApi.get(`/repos/${org}/${repo}/contributors`);
      return response.data; // Array of contributors
    } catch (error) {
      console.error(`Error fetching contributors for ${repo}:`, error);
      return [];
    }
  }
  async function fetchFirstCommitDate(org, repo, contributor) {
    try {
      const response = await githubApi.get(`/repos/${org}/${repo}/commits`, {
        params: { author: contributor.login }
      });
      if (response.data.length > 0) {
        return new Date(response.data[response.data.length - 1].commit.committer.date);
      }
      return null;
    } catch (error) {
      console.error(`Error fetching commits for contributor ${contributor.login}:`, error);
      return null;
    }
  }
  async function findNewContributors(org, repo, sinceDate) {
    const contributors = await fetchContributors(org, repo);
    const newContributors = [];
  
    for (const contributor of contributors) {
        const firstCommitDate = await fetchFirstCommitDate(org, repo, contributor);
        if (firstCommitDate && firstCommitDate >= sinceDate) {
            newContributors.push(contributor.login);
        }
    }
  
    const query = { org, repository: repo, year: sinceDate.getFullYear(), month: sinceDate.getMonth() + 1 };

    try {
        await Contributor.findOneAndUpdate(query, {
            $set: { newContributors }
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
    } catch (error) {
        console.error(`Error upserting data for ${repo}:`, error);
    }

    return newContributors;
}
  

  module.exports = {
    findNewContributors
  };
