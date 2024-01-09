const express = require('express')
const githubRoutes = require('./githubRoutes')
const router = express.Router()


// GET  api/status/
router.get('/status',(req,res) => {
    res.status(200).send("App Status : Working")
})

router.use('/githubRoute',githubRoutes)

module.exports = router