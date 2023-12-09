import axios from 'axios';
import axiosRetry from 'axios-retry';
import rateLimit from 'axios-rate-limit';

import { GITHUB_TOKEN } from '../config/config';

const githubClient = rateLimit(
  axios.create({
  baseURL: 'https://api.github.com',
  headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
}),{
  maxRequests: 10, 
  perMilliseconds: 1000, 
  maxRPS: 10 
});

axiosRetry(githubClient, {
  retries: 3, 
  retryDelay: retryCount => retryCount * 2000, 
  retryCondition: (error:any) => {
    const rateLimitError = error.response?.status === 403 && error.response.data.message.includes('API rate limit exceeded');
    return rateLimitError;
  }
});

export const getNewContributors = async (org: string, repo: string, year: number, month?: number) => {
    try{

      const sinceDate = new Date(year, month ? month - 1 : 0, 1);
      const contributorsResponse = await githubClient.get(`/repos/${org}/${repo}/contributors`);
      const contributors = contributorsResponse.data;

      const commitPromises = contributors.map((contributor:any) =>
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

    }catch (error) {
        console.error('Error fetching contributors from GitHub:', error);
        // throw error;
        return [];
    }
};