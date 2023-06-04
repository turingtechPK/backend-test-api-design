const express = require('express');
const githubService = require('./services/GithubService');

const app = express();
const PORT = 3000;


// Endpoint to fetch new contributors for a given year
app.get('/:org/:repo/:year', async (req, res) => {
  const { org, repo, year } = req.params;

  var result = await githubService.fetchAndStoreData(org, repo, year);

  res.json(result);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
