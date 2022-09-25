const { generateOptions } = require("../utils/utils");
const https = require("https");
const Repo = require("../Models/repoModel");
const Commit = require("../Models/commitModel");
const { createError } = require("../utils/customError");

//In this file I'm coding my middleware which get the data my making api calls
//and if the data is not present in the mongodb it put's it there.

//Simple HTTP get requests is used here

//This function gets all the repo of the owner, the owner name is in the request
module.exports.getAllRepos = async (req, res, next) => {
  try {
    var dataX;
    const options = generateOptions(
      "/users/" + req.params.ownerName + "/repos"
    );
    const data = await https.request(options, (res) => {
      let datA = "";
      res.on("data", (d) => {
        datA += d;
      });
      res.on("end", (d) => {
        dataX = JSON.parse(datA);
        dataX.map((dat) => {
          const repo = new Repo({
            RepoName: dat.name,
            RepoUrl: dat.url,
            RepoOwnerId: dat.owner.id,
            RepoOwnerName: dat.owner.login,
            RepoCreateOn: dat.created_at,
          });
          this.getAllContributoors(repo, req.params.ownerName, dat.name, next);
        });
        next();
      });
    });

    data.on("error", (error) => {
      return next(createError(406, "Error in Repo Fetch from Git API"));
    });

    data.end();
  } catch (error) {
    return next(createError(406, "Error in Repo Fetch from Git API"));
  }
};

//This function gets all the commit of aparticular repo and saves it in the database
module.exports.getAllContributoors = async (repo, owner, repoName, next) => {
  try {
    const options = generateOptions(
      "/repos/" + owner + "/" + repoName + "/commits"
    );
    const check = Repo.findOne({ RepoName: repo.RepoName });
    if (!check) {
      await repo.save().catch(console.log("Duplicate Entry"));
      const data = await https.request(options, (res) => {
        let datA = "";
        res.on("data", (d) => {
          datA += d;
        });
        res.on("end", (d) => {
          dataX = JSON.parse(datA);
          dataX.map((dat) => {
            const date = dat.commit.committer.date.split("-");
            const commit = new Commit({
              RepoId: repo._id,
              CommitUrl: dat.url,
              CommitName: dat.commit.committer.name,
              CommitEmail: dat.commit.committer.email,
              CommitYear: date[0] || "2000",
              CommitMonth: date[1] || "0",
            });
            if (!Commit.findOne({ CommitUrl: commit.CommitUrl })) {
              commit.save().catch(console.log("Duplicate Entry"));
            }
          });
        });
      });

      data.on("error", (error) => {
        return next(createError(407, "Error in Getting Commits from Git API"));
      });

      data.end();
    }
  } catch (error) {
    return next(createError(408, "Error in Saving Commits to MongoDB"));
  }
};
