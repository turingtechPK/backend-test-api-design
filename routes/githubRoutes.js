const express = require('express')
const router = express.Router()
const { getgithubByYear, getgithubByMonth } = require('../controllers/githubController')

// GET  api/githubRoute/status/
router.get('/status', (req, res) => {
    res.status(200).send("App Status : Working (Github)")
})

router.get('/:org/:repository/:year', getgithubByYear);
router.get('/:org/:repository/:year/:month', getgithubByMonth);

module.exports = router