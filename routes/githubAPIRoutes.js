const express = require('express')
const ghAPIController = require('../controllers/githubAPIController')

const router = express.Router()

router.get('/contributors/:owner/:repo', ghAPIController.getContributors)
router.get('/commits/:owner/:repo', ghAPIController.getCommits)
router.get('/newContributors/:owner/:repo', ghAPIController.newContributor)
router.get('/newContributors/:owner/:repo/:year', ghAPIController.newContributor)
router.get('/newContributors/:owner/:repo/:year/:month', ghAPIController.newContributor)


module.exports = router
