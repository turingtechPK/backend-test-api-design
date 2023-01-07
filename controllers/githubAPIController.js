require('dotenv').config()
const { setRequestOptions } = require('../utilities/setRequestOptions')
const https = require('https')
console.log(process.env.GITHUB_TOKEN)

const constants = require('../constants')
const Repository = require('../models/repository')
const moment = require('moment/moment')

const getContributors = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo
  const options = setRequestOptions(`/repos/${owner}/${repo}/contributors`)
  try {
    https
      .get(options, function (apiResponse) {
        apiResponse.pipe(res) // directly output the response
      })
      .on('error', (e) => {
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    //print the data from the error

    res.status(500).send(constants.unknownErrorMessage)
  }
}

const getCommits = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo
  const options = setRequestOptions(
    `/repos/${owner}/${repo}/commits?per_page=100`,
  )
  try {
    https
      .get(options, function (apiResponse) {
        apiResponse.pipe(res) // directly output the response
      })
      .on('error', (e) => {
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    //print the data from the error

    res.status(500).send(constants.unknownErrorMessage)
  }
}

const newContributor = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo
  let year = parseInt(req.params.year || 0)
  let month = parseInt(req.params.month || 0)

  let savedRepo = await Repository.findOne({
    owner: owner,
    repo: repo,
  })
  if (!savedRepo) {
    savedRepo = new Repository({
      owner: owner,
      repo: repo,
    })
  }

  getContributorsFunction(req, res, savedRepo)
}

const getContributorsFunction = async function (req, res, savedRepo) {
  const owner = savedRepo.owner
  const repo = savedRepo.repo
  const options = setRequestOptions(`/repos/${owner}/${repo}/contributors`)

  try {
    https
      .get(options, function (apiResponse) {
        let data = []

        if (apiResponse.statusCode !== 200) {
          return res.status(500).send(constants.unknownErrorMessage)
        }

        apiResponse.on('data', (chunk) => {
          data.push(chunk)
        })

        apiResponse.on('end', () => {
          console.log('Response ended: ')
          let contributors = JSON.parse(Buffer.concat(data).toString())

          let newContributors = {}

          console.log(contributors)
          contributors.forEach((contributor) => {
            console.log(contributor)
            if (!savedRepo.firstCommits?.[contributor.login]) {
              newContributors[contributor.login] = contributor.login
            }
          })

          if (newContributors != {}) {
            // call the commits api to find the date of the first commit of each new contributor
            getCommitsFunction(req, res, savedRepo, newContributors)
          } else {
            calculateNewContributors(req, res, savedRepo)
          }
        })
      })
      .on('error', (e) => {
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    res.status(500).send(constants.unknownErrorMessage)
  }
}

const getCommitsFunction = async function (
  req,
  res,
  savedRepo,
  newContributors,
) {
  // need to iterate this api call for getting all the commits later
  const options = setRequestOptions(
    `/repos/${savedRepo.owner}/${savedRepo.repo}/commits?per_page=100`,
  )
  try {
    https
      .get(options, function (apiResponse) {
        let data = []
        apiResponse.on('data', (chunk) => {
          data.push(chunk)
        })

        apiResponse.on('end', () => {
          console.log('Response ended: ')
          const commits = JSON.parse(Buffer.concat(data).toString())
          if (!savedRepo.firstCommits) {
            savedRepo.firstCommits = {}
          }
          // first commits of the new contributors will be saved as {[contributor]: earliest commit date}
          commits.forEach((commit) => {
            if (newContributors[commit.author.login]) {
              // compare the date of the commit with the saved date of the contributor
              let possibleFirstCommitDate = moment.min([
                new moment(commit.commit.author.date),
                new moment(savedRepo.firstCommits[commit.author.login]),
              ])
              savedRepo.firstCommits[
                commit.author.login
              ] = possibleFirstCommitDate
            }
          })

          savedRepo.save()
          calculateNewContributors(req, res, savedRepo)
        })
      })
      .on('error', (e) => {
        res.status(500).send(constants.unknownErrorMessage)
      })
  } catch (e) {
    //print the data from the error
    res.status(500).send(constants.unknownErrorMessage)
  }
}

const calculateNewContributors = async function (req, res, savedRepo) {
  // calculate the total number of new contributors from requested year and month to now
  let year = parseInt(req.params.year || 0)
  let month = parseInt(req.params.month || 0)

  let newContributorsCount = 0
  // create start date from the requested year and month
  let startDate = new moment(new Date(year, month - 1, 1))
  if (savedRepo.firstCommits) {
    for (const [key, value] of Object.entries(savedRepo.firstCommits)) {
      if (value > startDate) {
        newContributorsCount++
      }
    }
  }
  res.json({
    org: savedRepo.owner,
    repository: savedRepo.repo,
    year: year,
    month: month,
    newContributors: newContributorsCount,
  })
}
module.exports = { getContributors, getCommits, newContributor }
