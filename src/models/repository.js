const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
  org: { type: String, required: true },
  repo: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number, default: 0 },
  newContributors: { type: Number, default: 0 },
});

const Repository = mongoose.model("Repository", repositorySchema);

module.exports = Repository;
