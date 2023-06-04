const axios = require('axios');

// GitHub API configuration
const GITHUB_API_BASE_URL = 'https://api.github.com';
const GITHUB_ACCESS_TOKEN = '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';

// Function to fetch new contributors for a repository
async function getNewContributors(org, repo) {
    const url = `${GITHUB_API_BASE_URL}/repos/${org}/${repo}/commits`;
    const header = {
      headers: {
          'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`
      }
    }
    
    let contributors = [];
  
    try {
      const response = await axios.get(url, header);
      contributors = response.data;
    } catch (error) {
      console.error(`Error fetching contributors for ${org}/${repo}:`, error.message);
    }
  
    return contributors;
  }
  
  // Function to compute new contributors for all repositories
  async function computeNewContributors(org, repo, yearParam) {
    const contributors = await getNewContributors(org, repo);
    let filteredContributors = contributors.filter(element => {
      return parseInt(element.commit.author.date) <= parseInt(yearParam);
    })
    const repoData = {
      org,
      repository: repo,
      year: yearParam,
      newContributors: filteredContributors.length,
    };
  
    return repoData;
  }


  module.exports = {computeNewContributors};