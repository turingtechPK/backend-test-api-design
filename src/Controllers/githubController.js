import express from 'express';
import githubService from '../Services/githubService.js';
const router = express.Router();
/**
 * Route to fetch new contributors from GitHub for a specific repository.
 * @param {string} org - GitHub organization
 * @param {string} repo - GitHub repository.
 * @param {string} year - Year for which to fetch new contributors.
 * @param {string} month - Month for which to fetch new contributors (optional).
 */
router.get('/:org/:repo/:year/:month?', async (req, res) => {
  try {
    const { org, repo, year, month } = req.params;

    // Here we are validating input parameters
    if (!org || !repo || !year) {
      return res.status(400).json({ error: 'Invalid input parameters' });
    }

    const newContributors = await githubService.computeNewContributors(
      org,
      repo,
      year,
      month
    );

    res.status(200).json({
      org,
      repository: repo,
      year,
      month,
      newContributors,
    });
  } catch (error) {
    console.error(error);

    // If there is validation error
    if (error.name === 'ValidationError') {
      return res.status(422).json({ error: 'Validation error' });
    }

    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
