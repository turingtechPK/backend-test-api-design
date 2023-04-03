const express = require('express');
const app = express();
const fetch = require('node-fetch');
const moment = require('moment');

// Set up authentication
const token = "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";
const headers = {
    'Authorization': `token ${token}`,
    'User-Agent': 'my-github-app'
  };
  

// Define the route to retrieve repository information
app.get('/contributors', async (req, res) => {
    const org = 'airbnb';
    const repos = await getRepositories(org);
    const contributorsByRepo = await Promise.all(repos.map(async (repo) => {
        const contributors = await getContributors(org, repo.name);
        const newContributorsByMonth = computeNewContributorsByMonth(contributors);
        return {
            name: repo.name,
            newContributorsByMonth: newContributorsByMonth
        };
    }));
    res.json(contributorsByRepo);
});


// Retrieve the repositories for an organization
async function getRepositories(org) {
    const perPage = 100; // Number of repositories per page
    let page = 1;
    let allRepos = [];
    let repos = [];
    
    do {
      const url = `https://api.github.com/orgs/${org}/repos?page=${page}&per_page=${perPage}&sort=updated`;
      const response = await fetch(url, { headers: headers });
      repos = await response.json();
      allRepos = allRepos.concat(repos);
      page++;
    } while (repos.length === perPage);
  
    return allRepos;
  }
  


// Retrieve the contributors for a repository
async function getContributors(org, repo) {
    const url = `https://api.github.com/repos/${org}/${repo}/contributors`;
    try {
        const response = await fetch(url, { headers: headers });
        const body = await response.text();
        const contributors = body ? JSON.parse(body) : [];
        return contributors;
    } catch (err) {
        console.error(`Failed to retrieve contributors for ${org}/${repo}: ${err.message}`);
        return [];
    }
}


// Compute the number of new contributors by month
function computeNewContributorsByMonth(contributors) {
    const newContributorsByMonth = {};
    const now = moment();
    contributors.forEach((contributor) => {
        const firstCommitDate = moment(contributor["created_at"]);
        let currentMonth = firstCommitDate.clone().startOf('month');
        while (currentMonth.isSameOrBefore(now, 'month')) {
            const yearMonth = currentMonth.format("YYYY-MM");
            if (newContributorsByMonth[yearMonth] === undefined) {
                newContributorsByMonth[yearMonth] = 1;
            } else {
                newContributorsByMonth[yearMonth]++;
            }
            currentMonth.add(1, 'month');
        }
    });
    return newContributorsByMonth;
}

  

// Start the server
app.listen(8000, () => {
    console.log('Server listening on port 8000');
});
