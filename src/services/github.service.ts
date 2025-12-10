import axios from 'axios';

const GITHUB_API = 'https://api.github.com';

export const createGitHubClient = (token?: string) => {
  return axios.create({
    baseURL: GITHUB_API,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      ...(token && { 'Authorization': `token ${token}` })
    },
    timeout: 30000
  });
};

export const getRepositories = async (org: string, token?: string) => {
  const client = createGitHubClient(token);
  const repositories = [];
  let page = 1;

  try {
    while (true) {
      const response = await client.get(`/orgs/${org}/repos`, {
        params: { 
          type: 'public', 
          per_page: 100, 
          page 
        }
      });

      if (response.data.length === 0) break;
      repositories.push(...response.data);
      page++;
      
      // Simple rate limit handling
      if (response.headers['x-ratelimit-remaining'] < '10') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error: any) {
    throw new Error(`Failed to fetch repositories: ${error.response?.data?.message || error.message}`);
  }

  return repositories;
};

export const getContributors = async (org: string, repo: string, token?: string) => {
  const client = createGitHubClient(token);
  const contributors = [];
  let page = 1;

  try {
    while (true) {
      const response = await client.get(`/repos/${org}/${repo}/contributors`, {
        params: { per_page: 100, page }
      });

      if (response.data.length === 0) break;
      contributors.push(...response.data);
      page++;

      // Simple rate limit handling
      if (response.headers['x-ratelimit-remaining'] < '10') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      return []; // Empty repository
    }
    throw new Error(`Failed to fetch contributors: ${error.response?.data?.message || error.message}`);
  }

  return contributors;
};

export const getCommitsForYear = async (org: string, repo: string, year: number, token?: string) => {
  const client = createGitHubClient(token);
  const commits = [];
  let page = 1;
  
  const startDate = new Date(year, 0, 1).toISOString();
  const endDate = new Date(year, 11, 31, 23, 59, 59).toISOString();

  try {
    while (page <= 10) { // Limit to 10 pages to avoid rate limits
      const response = await client.get(`/repos/${org}/${repo}/commits`, {
        params: { 
          per_page: 100, 
          page,
          since: startDate,
          until: endDate
        }
      });

      if (response.data.length === 0) break;
      commits.push(...response.data);
      page++;

      // Simple rate limit handling
      if (response.headers['x-ratelimit-remaining'] < '10') {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  } catch (error: any) {
    if (error.response?.status === 409) {
      return []; // Empty repository
    }
    throw new Error(`Failed to fetch commits: ${error.response?.data?.message || error.message}`);
  }

  return commits;
};

export const getUserFirstCommitDate = async (org: string, repo: string, username: string, token?: string) => {
  const client = createGitHubClient(token);
  
  try {
    const response = await client.get(`/repos/${org}/${repo}/commits`, {
      params: { 
        author: username,
        per_page: 1,
        order: 'asc'
      }
    });

    if (response.data.length > 0) {
      return new Date(response.data[0].commit.author.date);
    }
  } catch (error: any) {
    console.warn(`Failed to get first commit for ${username}: ${error.message}`);
  }
  
  return null;
};