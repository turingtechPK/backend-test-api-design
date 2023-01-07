require('dotenv').config()
const { setRequestOptions } = require('../utilities/setRequestOptions')
const https = require('https')
console.log(process.env.GITHUB_TOKEN)

const constants = require('../constants')
const Repository = require('../models/repository')
const moment = require('moment/moment')
const parseLinkHeader = require('parse-link-header')

const getContributors = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo
  try {
    getData(
      `/repos/${owner}/${repo}/contributors?page=1&per_page=100`,
    ).then((resp) => res.json(resp.data))
  } catch (e) {
    res.status(500).send(constants.unknownErrorMessage)
  }
}

const getCommits = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo
  try {
    let commits = await getAllCommits(owner, repo)
    res.json(commits)
  } catch (e) {
    console.log(e)
    res.status(500).send(constants.unknownErrorMessage)
  }
}

const newContributors = async function (req, res) {
  const owner = req.params.owner
  const repo = req.params.repo

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

  let contributors = await getAllContributors(owner, repo)
  if (contributors?.message) {
    console.log(contributors);
    if(contributors.message?.includes('API rate limit exceeded')) {
      return res.status(500).send(constants.rateLimitExceeded)
    }
    return res.status(500).send(constants.invalidParams)
  }
  let newContributors = {}

  contributors?.forEach((contributor) => {
    if (!savedRepo.firstCommits?.[contributor.login]) {
      newContributors[contributor.login] = contributor.login
    }
  })

  if (newContributors && Object.keys(newContributors).length > 0) {
    // call the commits api to find the date of the first commit of each new contributor
    let commitsSince
    if (savedRepo.updatedAt) {
      commitsSince = savedRepo.updatedAt
      commitsSince = moment(commitsSince).format('YYYY-MM-DD')
      console.log(commitsSince)
    }
    let commits = await getAllCommits(owner, repo, commitsSince)
    commits.forEach((commit) => {
      if (newContributors[commit.author.login]) {
        // compare the date of the commit with the saved date of the contributor
        let possibleFirstCommitDate = moment.min([
          new moment(commit.commit.author.date),
          new moment(savedRepo.firstCommits[commit.author.login]),
        ])
        savedRepo.firstCommits[commit.author.login] = possibleFirstCommitDate
      }
    })
  }
  await savedRepo.save()
  calculateNewContributors(req, res, savedRepo)
}

const calculateNewContributors = async function (req, res, savedRepo) {
  // calculate the total number of new contributors from requested year and month to now
  let year = parseInt(
    req.params.year && req.params.year > 1969 ? req.params.year : 1970,
  )
  let month = parseInt(
    req.params.month && 13 > req.param.month > 0 ? req.params.month : 1,
  )

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

async function getData(url) {
  const options = setRequestOptions(url)
  return new Promise((resolve, reject) => {
    https
      .get(options, (response) => {
        let data = ''
        response.on('data', (chunk) => {
          data += chunk
        })
        response.on('end', () => {
          resolve({
            headers: response.headers,
            data: JSON.parse(data),
          })
        })
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

const getAllContributors = async function (owner, repo) {
  let contributors = await getData(
    `/repos/${owner}/${repo}/contributors?page=1&per_page=100`,
  )
  let links = parseLinkHeader(contributors.headers.link)
  let nextResponse = links?.next?.url
  console.log(nextResponse)
  // get all cointributors of this repo from the paginated api
  while (nextResponse) {
    const contributorsNextPage = await getData(nextResponse)
    links = parseLinkHeader(contributorsNextPage.headers.link)
    nextResponse = links?.next?.url
    console.log('@@NEXTRESPONSE', nextResponse)
    contributors.data = contributors.data.concat(contributorsNextPage.data)
  }
  return contributors.data
}

const getAllCommits = async function (owner, repo, since) {
  let commits = await getData(
    !since
      ? `/repos/${owner}/${repo}/commits?page=1&per_page=100`
      : `/repos/${owner}/${repo}/commits?page=1&per_page=100&since=${since}-01T00:00:00Z`,
  )

  let links = parseLinkHeader(commits.headers.link)
  console.log(links)
  let nextResponse = links?.next?.url
  console.log(nextResponse)
  // get all cointributors of this repo from the paginated api
  while (nextResponse) {
    const contributorsNextPage = await getData(nextResponse)
    links = parseLinkHeader(contributorsNextPage.headers.link)
    nextResponse = links?.next?.url
    console.log(nextResponse)
    commits.data = commits.data.concat(contributorsNextPage.data)
  }
  return commits.data
}

module.exports = { getContributors, getCommits, newContributors }
