const fetch = require("node-fetch");
require("dotenv").config(); // Load environment variables from .env file

const BASE_URL = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

async function fetchFromGitHub(org, repo, year, month = null) {
  // Construct the URL
  let url = `${BASE_URL}/repos/${org}/${repo}/commits`;
  let commits;

  // Fetch the data
  do {
    try {
      const response = await fetch(url, { headers });

      // Check whether the request was successful
      if (response.status === 200) {
        try {
          // Parse the response
          commits = await response.json();
        } catch (error) {
          throw new Error(`Error parsing JSON: ${error.message}`);
        }
        break;
      }

      // Check whether the rate limit has been reached
      else if (response.status === 403) {
        const remaining = response.headers.get("x-ratelimit-remaining");
        if (remaining === "0") {
          const resetTime = response.headers.get("x-ratelimit-reset"); // Get the reset time in seconds
          const now = new Date().getTime() / 1000; // Convert to seconds
          const secondsToWait = resetTime - now + 1000; // Calculate remaining seconds. Add 1 second to be sure the rate limit has been reset
          await new Promise((resolve) => setTimeout(resolve, secondsToWait));
        }
        // Handle other 403 errors
        else {
          throw new Error(`Error fetching data: ${response.message}`);
        }
      }

      // Handle other errors
      else {
        throw new Error(`Error fetching data: ${response.message}`);
      }
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  } while (true);

  const newContributors = new Set(); // Use a set to avoid duplicates
  const firstCommitDateByUser = {}; // Keep track of the first commit date for each user
  // Iterate over the commits
  for (const commit of commits) {
    const commitDate = new Date(commit.commit.author.date); // Get the commit date
    const contributer = commit.author; // Get the contributer's data

    // Check whether the contributer has committed before
    if (!firstCommitDateByUser[contributer.login]) {
      firstCommitDateByUser[contributer.login] = commitDate;

      // If the commit is the first one, check whether it is in the specified year and month
      if (
        commitDate.getFullYear() === year &&
        (month === null || commitDate.getMonth() === month)
      ) {
        newContributors.add(contributer.login);
      }
    }
  }

  return newContributors.size;
}
