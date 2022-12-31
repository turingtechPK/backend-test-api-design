const axios = require('axios');
const moment = require('moment');
const { host_name, organization_name, error_message } = require('../constants/constants');

// Geting All repos Data
async function getAllReposData(req, res) {
  try {
    let { year, month } = req.query;
    const response = await axios.get(`https://${host_name}/users/${organization_name}/repos`);
    const data = response.data;
    let finalData = [];
    data.map(async (repo) => {
      let reponame = repo.name;
      let newobj = {};
      newobj.org = organization_name;
      newobj.year = year;
      newobj.repository = repo.name;
      newobj.newContributors = await newContributor(reponame, year, month);
      finalData.push(newobj);
    });
    return finalData;
  } catch (error) {
    console.log(error.message);
    return res.status(401).json(error_message);
  }
}

// Finding New contributors by repository name, month and year
async function newContributor(repo_name, year, month) {
  try {
    let uniqueContributorsEmail = new Set();
    let response = await axios.get(
      `https://${host_name}/repos/${organization_name}/${repo_name}/commits`
    );
    let data = response.data;
    data.map((obj) => {
      let objDateYear = moment(obj.commit.author.date).format('YYYY');
      let objDateMonth = moment(obj.commit.author.date).format('MM');
      //  if any query contains
      if (year || month) {
        if (month === objDateMonth) {
          console.log('Found');
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
    // converting Set to object
    // {
    //   1: "umar@gmail.com", ...
    // }
    if (uniqueContributorsEmail) {
      const obj = Object.assign(...Array.from(uniqueContributorsEmail, (v, i) => ({ i: [v] })));
      return obj;
    } else {
      return {};
    }
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = {
  getAllReposData,
};
