const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');

router.get('/:org/:repo/:year/:month', async (req, res) => {
  const { org, repo, year, month } = req.params;
  const sinceDate = new Date(year, month - 1, 1);

  try {
    const newContributors = await githubController.findNewContributors(org, repo, sinceDate);
    res.json({
      org,
      repository: repo,
      year,
      month,
      newContributors
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
