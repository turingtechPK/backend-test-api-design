var express = require('express');
var router = express.Router();
const {spotifyController} = require('../controllers/spotifyController');

router.get('/', spotifyController.newContributors); 

module.exports = router;