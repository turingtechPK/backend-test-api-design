const githubService = require('../services/githubService');

const getgithubByYear = async (req, res) => {
    try {
        const { org, repository, year } = req.params;
        const newContributors = await githubService.getContributorsByYear(org, repository, year);
        res.json({ org, repository, year, newContributors });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};


const getgithubByMonth = async (req, res) => {
    try {
        const { org, repository, year, month } = req.params;
        const newContributors = await githubService.getContributorsByMonth(org, repository, year, month);
        res.json({ org, repository, year, month, newContributors });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getgithubByYear,
    getgithubByMonth
};