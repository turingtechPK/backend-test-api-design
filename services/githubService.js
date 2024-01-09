const GithubModel = require('../models/githubModel');
const utils = require('../utils/utils');
const axios = require('axios');

const getContributorsByYear = async (org, repository, year) => {
    if (!utils.validateInputParameters(org, repository, year)) {
        throw new Error('Invalid input parameters');
    }

    let existingData = await GithubModel.findOne({ org, repository, year });
    if (existingData) {
        return existingData.new_githubs;
    } else {
        const newContributors = await utils.fetchNewContributorsFromGithub(org, repository, year);
        await GithubModel.create({ org, repository, year, new_githubs: newContributors });
        return newContributors;
    }
};

module.exports = {
    getContributorsByYear
};