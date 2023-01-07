require('dotenv').config()
const constants = require('../constants')

const setRequestOptions = (_path) => {
  return (options = {
    hostname: constants.hostname,
    path: _path,
    method: 'get',
    headers: {
      'User-Agent': constants.userAgency,
    },
    OAUth: process.env.GITHUB_ACCESS_TOKEN,
  })
}

module.exports = { setRequestOptions }
