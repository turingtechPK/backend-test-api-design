import axios from 'axios';
import axiosRetry from 'axios-retry';

const githubAxios = axios.create();

// Setting up axios-retry
axiosRetry(githubAxios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) || isRateLimitError(error),
});

// Here we are adding an interceptor to handle rate limit headers
githubAxios.interceptors.response.use(
  (response) => {
    // Checking for GitHub rate limit headers
    const rateLimitLimit = response.headers['x-ratelimit-limit'];
    const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
    const rateLimitReset = response.headers['x-ratelimit-reset'];

    console.log(
      `Rate Limit: ${rateLimitRemaining}/${rateLimitLimit}. Reset at: ${new Date(
        rateLimitReset * 1000
      )}`
    );

    return response;
  },
  (error) => {
    // Handling Error
    return Promise.reject(error);
  }
);

function isRateLimitError(error) {
  return (
    error.response?.status === 403 &&
    error.response.headers['x-ratelimit-remaining'] === '0'
  );
}

export default githubAxios;
