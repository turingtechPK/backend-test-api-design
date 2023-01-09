// imported the required packages...
const { express } = require("../utils/packages");

// router
const gitHubAPIRouter = express.Router();

// controller
const gitHubAPIController = require("../controllers/gitHubAPIController");

// routes
gitHubAPIRouter.get("/new/contributors", gitHubAPIController.fetchAndStoreNewContributors);
gitHubAPIRouter.get("/get/new/contributors/:username/:reponame", gitHubAPIController.getNewContributors);
// gitHubAPIRouter.get("/new/contributors/:username/:reponame", gitHubAPIController.getNewContributors);
// gitHubAPIRouter.get("/get/repos/:username", gitHubAPIController.getAllRepositories);

// testing routes...
gitHubAPIRouter.get("/user/:username", gitHubAPIController.getUserDetails);
// gitHubAPIRouter.get('/repo/:username/:reponame', gitHubAPIController.getRepoDetials);
gitHubAPIRouter.get('/commit/:username/:reponame', gitHubAPIController.getCommits);


module.exports = gitHubAPIRouter;