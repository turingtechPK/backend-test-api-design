const database = require("../controllers/repositoryController");
const fetchFromGitHub = require("../services/githubService");

const fetchDataMiddleware = async (req, res, next) => {
  let { org, repo, year, month } = req.params;

  if (month)
    console.log(
      `Request received for ${org}/${repo} for the year ${year} and month ${month}...`
    );
  else
    console.log(`Request received for ${org}/${repo} for the year ${year}...`);

  // Convert the year and month to numbers
  year = parseInt(year);
  if (month) month = parseInt(month);

  // Check whether the data is already in the database
  let data = await database.getData(org, repo, year, month);
  // Check whether an error occurred
  if (data.error) {
    res.status(500).json({
      error: data.error,
    });
    console.log(data.error);
  }
  // Otherwise, return the data
  else if (data.data) {
    data = data.data;

    // Return the data according to the specified format
    if (data.month === 0) {
      req.data = {
        org: data.org,
        repo: data.repo,
        year: data.year,
        newContributors: data.newContributors,
      };
    } else {
      req.data = {
        org: data.org,
        repo: data.repo,
        year: data.year,
        month: data.month,
        newContributors: data.newContributors,
      };
    }
    next();
  }
  // If the data was not found, fetch it from GitHub
  else {
    data = await fetchFromGitHub(org, repo, year, month);

    // Check whether the data was fetched successfully
    if (data.error) {
      res.status(500).json({
        error: data.error,
      });
      console.log(data.error);
    } else {
      const newContributors = data.newContributors;

      // Save the data to the database
      const result = await database.saveData(
        org,
        repo,
        year,
        month,
        newContributors
      );

      // Return the data according to the specified format
      if (data.month === 0) {
        req.data = {
          org: org,
          repo: repo,
          year: year,
          newContributors: data.newContributors,
        };
      } else {
        req.data = {
          org: org,
          repo: repo,
          year: year,
          month: month,
          newContributors: data.newContributors,
        };
      }
      next();
    }
  }
};

module.exports = fetchDataMiddleware;
