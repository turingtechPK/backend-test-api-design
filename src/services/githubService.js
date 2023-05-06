require("dotenv").config(); // Load environment variables from .env file
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args)); // Import fetch from node-fetch
const parse = require("parse-link-header"); // Used  to parse the link header and get the last page number

const BASE_URL = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

async function fetchFromGitHub(org, repo, year, month = null) {
  let commits = [];
  let nextPage = 1,
    lastPage = -1;
  let hasMorePages = false;

  // Calculate the end date
  const endDate = `${year}-12-31T23:59:59Z`;

  let msg = `Fetching page ${nextPage}...`;

  // Fetch the data
  do {
    try {
      // Construct the URL
      let url = `${BASE_URL}/repos/${org}/${repo}/commits?until=${endDate}&per_page=100&page=${nextPage}`;
      console.log(msg);

      // Fetch the data
      const response = await fetch(url, { headers });

      // Check whether the request was successful
      if (response.status === 200) {
        try {
          // Parse the response
          data = await response.json();
          commits = commits.concat(data);

          // Check whether there are more pages
          if (!hasMorePages) {
            // Get the link header
            const linkHeader = response.headers.get("link");

            if (linkHeader) {
              // Parse the link header and get the last page number
              const links = parse(linkHeader);
              const lastLinkUrl = links.last.url;
              const lastLinkUrlParams = new URLSearchParams(
                lastLinkUrl.split("?")[1]
              );
              lastPage = lastLinkUrlParams.get("page");

              hasMorePages = true;
            }
          }

          if (hasMorePages) {
            // Update the page number
            nextPage++;
            msg = `Fetching page ${nextPage} of ${lastPage}...`;

            // Check whether the last page has been reached
            if (nextPage > lastPage) {
              hasMorePages = false;
            }
          }
        } catch (error) {
          return {
            error: "Error parsing JSON",
          };
        }
      }

      // Check whether the rate limit has been reached
      else if (response.status === 403) {
        const remaining = response.headers.get("x-ratelimit-remaining");
        // If the rate limit has been reached, wait until the rate limit has been reset
        if (remaining === "0") {
          const resetTime = response.headers.get("x-ratelimit-reset"); // Get the reset time in seconds
          const now = new Date().getTime() / 1000; // Convert to seconds
          const secondsToWait = resetTime - now + 1000; // Calculate remaining seconds. Add 1 second to be sure the rate limit has been reset
          await new Promise((resolve) => setTimeout(resolve, secondsToWait));
        }
        // Handle other 403 errors
        else {
          return {
            error: "Error fetching data: 403",
          };
        }
      }

      // Handle other errors
      else {
        return {
          error: `Error fetching data: ${response.status}`,
        };
      }
    } catch (error) {
      // Handle network errors
      return {
        error: `Network error: ${error.message}`,
      };
    }
  } while (hasMorePages);

  const newContributors = new Set(); // Use a set to avoid duplicates
  const firstCommitDateByUser = {}; // Keep track of the first commit date for each user

  console.log(commits.length);

  // Iterate over the commits
  for (const commit of commits) {
    const commitDate = new Date(commit.commit.author.date); // Get the commit date
    const contributer = commit.author; // Get the contributer's data

    // Check whether the contributer's data is available
    if (!contributer || !contributer.login) {
      continue;
    }

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

  return {
    newContributers: newContributors.size,
  };
}

module.exports = fetchFromGitHub;
