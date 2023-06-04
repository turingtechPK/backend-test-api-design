const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
    path: './storage/new_contributors.csv',
    header: [
      { id: 'org', title: 'Organization' },
      { id: 'repository', title: 'Repository' },
      { id: 'year', title: 'Year' },
      { id: 'newContributors', title: 'New Contributors' },
    ],
  });

module.exports = {csvWriter}