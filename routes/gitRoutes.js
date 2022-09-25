const router = require("express").Router();
const {
  getRepoDataByOwner,
  getCommitsToARepoByYear,
  getCommitsToARepoByMonth,
} = require("../controllers/gitController");
const { getAllRepos } = require("../apiCall/gitApiCall");
//getAllRepos is a middleware that runs befoe all api's calls just to make sure that the
//data in the database is up-to date.

//Defining my Endpoints

//Gett all repos for a user
router.get("/:ownerName", getAllRepos, getRepoDataByOwner);

//Get all commits for a repo
router.get("/:ownerName/:repoName/:year", getAllRepos, getCommitsToARepoByYear);

//Get all commits for a repo
router.get(
  "/:ownerName/:repoName/:year/:month",
  getAllRepos,
  getCommitsToARepoByMonth
);

module.exports = router;
