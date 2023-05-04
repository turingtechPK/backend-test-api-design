const { Schema, model } = require("mongoose");
//model for the repository data
const repositorySchema = new Schema({
  org: String,
  repo: String,
  year: Number,
  month: Number,
  newContributors: Number,
});
const Repository = model('Repository', repositorySchema);

module.exports = Repository;
