const Repo = require("../Models/repoModel");
const Commit = require("../Models/commitModel");
//These are the controllers for my routes

//This functon will get all the repos for a particular user from the database, where the data was stored by apiCall
module.exports.getRepoDataByOwner = async (req, res) => {
  try {
    const allRepos = await Repo.find({ RepoOwnerName: req.params.ownerName });
    res.status(200).json(allRepos);
  } catch (error) {
    next(error);
  }
};

//This functon will return the requires object by fetching data from the db
// and using a hashmap to get the number of unique contributor by year
module.exports.getCommitsToARepoByYear = async (req, res) => {
  try {
    const repo = await Repo.findOne({
      RepoOwnerName: req.params.ownerName,
      RepoName: req.params.repoName,
    });
    if (repo) {
      const allCommits = await Commit.find({ RepoId: repo._id.toString() });
      if (allCommits) {
        let myNameMap = {};
        let totalContributions = 0;
        allCommits.map((commit) => {
          if (
            !myNameMap[commit.CommitName] &&
            commit.CommitYear === req.params.year
          ) {
            myNameMap[commit.CommitName] = 1;
            totalContributions += 1;
          } else {
            myNameMap[commit.CommitName] += 1;
          }
        });
        const myObject = {
          org: req.params.ownerName,
          repository: req.params.repoName,
          year: req.params.year,
          newContributors: totalContributions,
        };
        res.status(200).json(myObject);
      }
    } else {
      res.status(404).json({
        message: "This data doesn't exist, please change paremeters",
      });
    }
  } catch (error) {
    next(error);
  }
};

//This functon will return the requires object by fetching data from the db
// and using a hashmap to get the number of unique contributor by year and month
module.exports.getCommitsToARepoByMonth = async (req, res) => {
  try {
    const repo = await Repo.findOne({
      RepoOwnerName: req.params.ownerName,
      RepoName: req.params.repoName,
    });
    if (repo) {
      const allCommits = await Commit.find({ RepoId: repo._id.toString() });
      if (allCommits) {
        let myNameMap = {};
        let totalContributions = 0;
        allCommits.map((commit) => {
          if (
            !myNameMap[commit.CommitName] &&
            commit.CommitYear === req.params.year &&
            commit.CommitMonth === req.params.month
          ) {
            myNameMap[commit.CommitName] = 1;
            totalContributions += 1;
          } else {
            myNameMap[commit.CommitName] += 1;
          }
        });
        const myObject = {
          org: req.params.ownerName,
          repository: req.params.repoName,
          year: req.params.year,
          month: req.params.month,
          newContributors: totalContributions,
        };
        res.status(200).json(myObject);
      }
    } else {
      res.status(404).json({
        message: "This data doesn't exist, please change paremeters",
      });
    }
  } catch (error) {
    next(error);
  }
};
