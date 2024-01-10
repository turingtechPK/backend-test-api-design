import axios from 'axios';
import GithubData from '../Models/githubModel.js';

/**
 * Computes new contributors from GitHub API for a specific repository and stores the data in MongoDB.
 * @param {string} org - GitHub organization or user.
 * @param {string} repo - GitHub repository.
 * @param {string} year - Year for which to compute new contributors.
 * @param {string} month - Month for which to compute new contributors (optional).
 * @returns {Array} - Array of new contributors' data.
 */
async function computeNewContributors(org, repo, year, month) {
  try {
    let apiUrl = `https://api.github.com/repos/${org}/${repo}/contributors?since=${year}-01-01T00:00:00Z`;

    // If month is provided,we will append it to the API URL
    if (month) {
      // Here we are ensuring two-digit month format
      const formattedMonth = month.padStart(2, '0');
      apiUrl += `&until=${year}-${formattedMonth}-01T00:00:00Z`;
    }

    const response = await axios.get(apiUrl);

    // Store data in MongoDB
    const githubData = new GithubData({
      org,
      repository: repo,
      year,
      month,
      newContributors: response.data,
    });

    await githubData.save();

    return response.data;
  } catch (error) {
    // Handle 404 error (GitHub repository not found)
    if (error.response && error.response.status === 404) {
      console.error(`GitHub repository not found: ${org}/${repo}`);
      return [];
    }

    // Handle other errors
    console.error(`Error computing new contributors: ${error.message}`);
    throw error;
  }
}

// Exporting the function as part of an object for modularity
export default {
  computeNewContributors,
};
