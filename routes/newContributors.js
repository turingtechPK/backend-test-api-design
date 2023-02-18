const router = require("express").Router();
const { Octokit } = require('octokit')
//const verifyToken = require("../verifyToken");


router.get("/:org/:repo/:year?/:month?", async (req, res) => {

  const org = req.params.org;
  const repo = req.params.repo;
  const year = req.params.year;
  const month = req.params.month;
    try {
      const octokit = new Octokit({
        auth: process.env.AUTH_TOKEN,
      });
  
      const { data: commits } = await octokit.request(
        `GET /repos/${org}/${repo}/commits`,
        {
          owner: org,
          repo: repo,
        }
      );
  
      const monthYearName = {};

      //Fetching commit.author field of all the commits made
      const commitsField = commits.map(item => item.commit.author);
      commitsField.forEach((obj) => {
        const yearMonth = new Date(obj.date).toISOString().slice(0, 7);
        if (monthYearName[yearMonth]) {
            monthYearName[yearMonth].push(obj.name);
        } else {
            monthYearName[yearMonth] = [obj.name];
        }

        });

        const newContributors = {};
        const contributorsSet = new Set();
        
        //Getting data in "Year-month":newContributors format

        Object.keys(monthYearName).sort().forEach(month => {
            monthYearName[month].forEach(contributor => {
            if (!contributorsSet.has(contributor)) {
              contributorsSet.add(contributor);
              newContributors[month] = (newContributors[month] || 0) + 1;
            }
          });
        });


        //Getting data in "Year":newContributors format

        const contributorsByYear = {};
        for (const date in newContributors) {
          const year = date.substring(0, 4);
          const contributors = newContributors[date];
          if (contributorsByYear[year]) {
            contributorsByYear[year] += contributors;
          } else {
            contributorsByYear[year] = contributors;
          }
        }

        if(year && month){
          const yearMonthNew = year + "-" + month.padStart(2, "0");
          const contributorsByYearNew = newContributors[yearMonthNew]
          outputObj = {
            org: org,
            repository: repo,
            year: year,
            month: month,
            newContributors: contributorsByYearNew ? contributorsByYearNew : "0"
          }
        }

        else if(year){
          const contributorsByYearNew = contributorsByYear[year]
          outputObj = {
            org: org,
            repository: repo,
            year: year,
            newContributors: contributorsByYearNew ? contributorsByYearNew : "0"
          }
        }


  
      res.status(200).json(outputObj);
    } catch (err) {
      res.status(500).json(err);
    }
  });




 
  


module.exports = router




