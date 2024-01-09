const GithubModel = require('../models/githubModel');
const utils = require('../utils/utils');

const getContributorsByYear = async (org, repository, year) => {
    try {
        const newContributors = await utils.fetchNewContributorsFromGithub(org, repository, year);
        await GithubModel.create({ org, repository, year, new_contributors: newContributors });
        return newContributors;
    } catch (error) {
        if (error.message === 'Module is not set up yet') {
            // Handle the case where the utils module is not ready
            console.error('Utils module is not ready. Please try again later.');
        } else {
            // Handle other errors
            console.error('Error:', error);
        }
    }
};


const getContributorsByMonth = async (org, repository, year, month) => {
    try {
        const newContributors = await utils.fetchNewContributorsFromGithub(org, repository, year, month - 1);
        await GithubModel.create({ org, repository, year, month, new_contributors: newContributors });
        return newContributors;
    } catch (error) {
        if (error.message === 'Module is not set up yet') {
            console.error('Utils module is not ready. Please try again later.');
        } else {
            console.error('Error:', error);
        }
    }
}

module.exports = {
    getContributorsByYear,
    getContributorsByMonth
};