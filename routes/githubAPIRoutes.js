const express = require('express')
const ghAPIController = require('../controllers/githubAPIController')

const router = express.Router()


router.get('/newContributors/:owner/:repo', ghAPIController.newContributors)
router.get('/newContributors/:owner/:repo/:year', ghAPIController.newContributors)
router.get('/newContributors/:owner/:repo/:year/:month', ghAPIController.newContributors)

//test routes
router.get('/contributors/:owner/:repo', ghAPIController.getContributors)
router.get('/commits/:owner/:repo', ghAPIController.getCommits)

module.exports = router
