const express = require('express')
const ghAPIController = require('../controllers/githubAPIController')

const router = express.Router()

router.get('/contributors/:user/:reponame', ghAPIController.getContributors)
router.get('/commits/:user/:reponame', ghAPIController.getCommits)


module.exports = router
