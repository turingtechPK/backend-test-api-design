const csvService = require('./CsvService');
const githubRepository = require('../repository/GithubRepository');

async function fetchAndStoreData(organization, repository, year){
    const repoData = await githubRepository.computeNewContributors(organization, repository, year);

    csvService.csvWriter.writeRecords([repoData]).then(() => {
        console.log('Result saved to new_contributors.csv');
    }).catch((error) => {
        console.error('Error writing CSV file:', error);
    });

    return repoData;
}

module.exports = {fetchAndStoreData}