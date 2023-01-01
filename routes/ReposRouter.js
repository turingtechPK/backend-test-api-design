const express = require('express');
const { getHttpRepo } = require('../controllers/ReposController');

const ReposRouter = express.Router();

// Getting repositories
ReposRouter.get('/repos', getHttpRepo);

module.exports = ReposRouter;
