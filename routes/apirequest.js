const express = require('express');
const axios = require('axios');
const router = express.Router();
require("dotenv").config();
let mongoose = require('mongoose');
let Contributors = require('../models/contributors');
repositories = []
const authToken = process.env.authToken;

//request to fetch contributors by specifying organization,repository,year
router.get('/:org/:repository/:year', async (req, res) => {
  const { org, repository, year } = req.params;
  console.log(org, repository, year);
  const apiUrl = `https://api.github.com/repos/${org}/${repository}/stats/contributors`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    // Check the rate limit headers
    const remaining = parseInt(response.headers['x-ratelimit-remaining']);
    const resetTime = parseInt(response.headers['x-ratelimit-reset']);

    // If we have exceeded the rate limit, wait for the reset time
    if (remaining === 0) {
      const now = new Date().getTime() / 1000;
      const waitTime = resetTime - now + 1;
      console.log(`Rate limit exceeded. Waiting ${waitTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
    const contributors = response.data
      .filter(contributor => {
        // Filter contributors who have only made one contribution
        const totalCommits = contributor.weeks.reduce((acc, week) => acc + week.c, 0);
        return totalCommits === 1 && new Date(contributor.weeks[0].w * 1000).getFullYear() === parseInt(year);
      })
      .map(contributor => contributor.author.login);

    // Log the number of new contributors found for which year
    console.log(`${contributors.length} new contributors found for ${org}/${repository} in ${year}`);
    if (contributors.length !== 0) {
      console.log(`${contributors.join(', ')}`);
    }


    if (contributors.length !== 0) {
      // Save the new contributors to the database
      const newContributors = new Contributors({
        Organization: org,
        Repository: repository,
        Year: parseInt(year),
        NewContributors: contributors,
      });

      await newContributors.save();
    }

    // Send a JSON response with the new contributors
    res.status(200).json({
      org,
      repository,
      year,
      newContributors: contributors,
    });
    // If an error occurs, log it and send a server error response
  } catch (error) {
    console.error(`Error fetching contributors for ${org}/${repository} in ${year}: ${error}`);
    res.status(500).send('Server Error');
  }
});

//request to fetch contributors by specifying organization,repository,year,month
//http://localhost:5000/whatsapp/erlfmt/2019/10
router.get('/:org/:repository/:year/:month', async (req, res) => {
  const { org, repository, year, month } = req.params;
  console.log(org, repository, year, month);
  const apiUrl = `https://api.github.com/repos/${org}/${repository}/stats/contributors`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Check the rate limit headers
    const remaining = parseInt(response.headers['x-ratelimit-remaining']);
    const resetTime = parseInt(response.headers['x-ratelimit-reset']);

    // If we have exceeded the rate limit, wait for the reset time
    if (remaining === 0) {
      const now = new Date().getTime() / 1000;
      const waitTime = resetTime - now + 1;
      console.log(`Rate limit exceeded. Waiting ${waitTime} seconds...`);
      await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
    const contributors = response.data
      .filter(contributor => {
        // Filter contributors who have only made one contribution
        const totalCommits = contributor.weeks.reduce((acc, week) => acc + week.c, 0);
        const weekDate = new Date(contributor.weeks[0].w * 1000);
        return totalCommits === 1 && weekDate.getFullYear() === parseInt(year) && weekDate.getMonth() === parseInt(month) - 1;
      })
      .map(contributor => contributor.author.login);

    // Log the number of new contributors found for which year/month
    console.log(`${contributors.length} new contributors found for ${org}/${repository} in ${year}/${month}`);
    if (contributors.length !== 0) {
      console.log(`${contributors.join(', ')}`);
    }

    if (contributors.length !== 0) {
      // Save the new contributors to the database
      const newContributors = new Contributors({
        Organization: org,
        Repository: repository,
        Year: parseInt(year),
        Month: parseInt(month),
        NewContributors: contributors,
      });
      await newContributors.save();
    }

    // Send a JSON response with the new contributors
    res.status(200).json({
      org,
      repository,
      year,
      month,
      newContributors: contributors,
    });
    // If an error occurs, log it and send a server error response
  } catch (error) {
    console.error(`Error fetching contributors for ${org}/${repository} in ${year}/${month}: ${error}`);
    res.status(500).send('Server Error');
  }
});

// Export the router for use in your application
module.exports = router;
