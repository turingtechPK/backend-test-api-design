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