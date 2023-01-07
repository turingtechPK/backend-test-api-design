require('dotenv').config()
const { setRequestOptions } = require('../utilities/setRequestOptions')
const https = require('https')
console.log(process.env.GITHUB_TOKEN)

const constants = require('../constants')

const getContributors = async function (req, res) {
  const owner = req.params.user
  const repo = req.params.reponame
  const options = setRequestOptions(
    `/repos/${owner}/${repo}/contributors?anon=1`,
  )
  try {
    https
      .get(options, function (apiResponse) {
        // apiResponse.pipe(apiResponse)  // directly output the response
        let data = []
        const headerDate = apiResponse?.headers?.date || 'no response date'
        console.log('Status Code:', apiResponse.statusCode)
        console.log('Date in Response header:', headerDate)
        apiResponse.on('data', (chunk) => {
          data.push(chunk)
        })

        apiResponse.on('end', () => {
          console.log('Response ended: ')
          const commits = JSON.parse(Buffer.concat(data).toString())
          console.log(commits)
          res.send(commits)
        })
      })
      .on('error', (e) => {
        console.log(e)
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    //print the data from the error
    console.log(e)
    res.status(500).send(constants.unknownErrorMessage)
  }
}

const getCommits = async function (req, res) {
  const owner = req.params.user
  const repo = req.params.reponame
  const options = setRequestOptions(
    `/repos/${owner}/${repo}/commits?anon=1`,
  )
  try {
    https
      .get(options, function (apiResponse) {
        // apiResponse.pipe(apiResponse)  // directly output the response
        let data = []
        const headerDate = apiResponse?.headers?.date || 'no response date'
        console.log('Status Code:', apiResponse.statusCode)
        console.log('Date in Response header:', headerDate)
        apiResponse.on('data', (chunk) => {
          data.push(chunk)
        })

        apiResponse.on('end', () => {
          console.log('Response ended: ')
          const commits = JSON.parse(Buffer.concat(data).toString())
          // console.log(commits)
          res.json(commits)
        })
      })
      .on('error', (e) => {
        console.log(e)
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    //print the data from the error
    console.log(e)
    res.status(500).send(constants.unknownErrorMessage)
  }
}

module.exports = { getContributors, getCommits }
