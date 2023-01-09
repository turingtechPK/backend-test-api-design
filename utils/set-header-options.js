const { constants } = require('./constants');

const generateOptions = (_path) => {
    return (options = {
        hostname: constants.hostname,
        path: _path,
        method: 'GET',
        headers: {
          'User-Agent': constants.userAgent,
        },
        // OAUth: process.env.GITHUB_TOKEN,
    });
}

module.exports = { generateOptions }