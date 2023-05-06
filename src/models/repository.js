const mongoose = require("mongoose");

const repositorySchema = new mongoose.Schema({
  org: { String, required: true },
  repository: { String, required: true },
  year: { Number, required: true },
  month: { Number, default: 0 },
  newContributors: { Number, default: 0 },
});

const Repository = mongoose.model("Repository", repositorySchema);
