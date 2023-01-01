const { getAllReposData } = require('../models/ReposModel');

async function getHttpRepo(req, res) {
  return res.status(200).json(await getAllReposData(req, res));
}

module.exports = { getHttpRepo };
