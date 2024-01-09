const express = require('express')
const router = express.Router()
const {signup, login, deleteStudent, updateStudent, getStudent, getStudentCount} = require('../controllers/githubController')

// GET  api/githubRoute/status/
router.get('/status',(req,res) => {
    res.status(200).send("App Status : Working (Github)")
})

router.get('/:org/:repository/:year', githubController.getgithubByYear);
router.get('/:org/:repository/:year/:month', githubController.getgithubByMonth);

module.exports = router