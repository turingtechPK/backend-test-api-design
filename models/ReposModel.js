const axios = require('axios');
const moment = require('moment');
const { host_name, organization_name, error_message } = require('../constants/constants');
const config = require('../config/headers');

// Geting All repos Data
async function getAllReposData(req, res) {
  try {
    let { year, month } = req.query;
    const response = await axios.get(
      `https://${host_name}/users/${organization_name}/repos`,
      config
    );
    const data = response.data;
    const finalData = [];

    for (const repo of data) {
      const reponame = repo.name;
      const newobj = {};
      newobj.org = organization_name;
      newobj.year = year || null;
      if (month) {
        newobj.month = month;
      }
      newobj.repository = repo.name;
      newobj.newContributors = await newContributor(reponame, year, month);
      finalData.push(newobj);
    }

    console.log('finalData');
    return finalData;
  } catch (error) {
    console.log(error);
    return res.status(401).json(error_message);
  }
}

// Finding New contributors by repository name, month and year
async function newContributor(repo_name, year, month) {
  try {
    let uniqueContributorsEmail = new Set();
    let response = await axios.get(
      `https://${host_name}/repos/${organization_name}/${repo_name}/commits`,
      config
    );
    let data = response.data;
    data.map((obj) => {
      let objDateYear = moment(obj.commit.author.date).format('YYYY');
      let objDateMonth = moment(obj.commit.author.date).format('MM');
      //  if any query contains
      if (year || month) {
        if (month === objDateMonth && year === objDateYear) {
          if (!uniqueContributorsEmail.has(obj.commit.author.email)) {
            uniqueContributorsEmail.add(obj.commit.author.email);
          }
        }
        if (year === objDateYear) {
          if (!uniqueContributorsEmail.has(obj.commit.author.email)) {
            uniqueContributorsEmail.add(obj.commit.author.email);
          }
        }
      } else {
        if (!uniqueContributorsEmail.has(obj.commit.author.email)) {
          uniqueContributorsEmail.add(obj.commit.author.email);
        }
      }
    });
    // converting Set to proper object like
    // {
    //   0: "umar@gmail.com", ...
    // }
    const obj = Object.assign({}, [...uniqueContributorsEmail]);
    return obj;
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAllReposData,
  newContributor,
};
