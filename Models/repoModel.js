const mongoose = require("mongoose");
//Custom Schema to keep track to all the repositories
const repoSchema = mongoose.Schema({
  RepoName: {
    type: String,
    required: true,
    unique: true,
  },
  RepoUrl: {
    type: String,
    required: true,
  },
  RepoOwnerId: {
    type: String,
    required: true,
  },
  RepoOwnerName: {
    type: String,
    required: true,
  },
  RepoCreateOn: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Repo", repoSchema);
