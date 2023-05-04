const express = require("express");
const repositoryController = require("../controllers/repositoryController");
//using express router
const router = express.Router();
//our API route
router.get("/:org/:repo/:year/:month?", repositoryController.getRepositoryData);

module.exports = router;
