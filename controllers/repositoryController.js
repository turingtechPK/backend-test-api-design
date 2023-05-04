const Repository = require("../models/Repository");
const githubService = require("../services/githubstats");

async function getRepositoryData(req, res) {
    //get the org, repo, year, month from the request parameters
    const { org, repo, year, month } = req.params;

    try {
        // Check if the data already exists in the database
        const existingData = await Repository.find({ org, repo, year, month });
        if (existingData.length > 0) {
            return res.json(existingData);
        }

        // If not, fetch the data from the GitHub API
        const since = new Date(year, month ? month - 1 : 0, 1);
        const newContributors = await githubService.getNewContributors(org, repo, since);

        // Save the fetched data to the database
        const repositoryData = new Repository({
        org,
        repo,
        year,
        month: month || 01,//if month is not provided, set it to 01
        newContributors,
        });
        await repositoryData.save();

        // Return the data
        res.json(repositoryData);
    } catch (error) {
        console.error(`Error fetching repository data: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getRepositoryData };
