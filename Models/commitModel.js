const mongoose = require("mongoose");
//Custome Model TO keep track of all the commits
const commitSchema = mongoose.Schema({
  RepoId: {
    type: String,
    required: true,
  },
  CommitUrl: {
    type: String,
    required: true,
    unique: true,
  },
  CommitName: {
    type: String,
    required: true,
  },
  CommitEmail: {
    type: String,
    required: true,
  },
  CommitYear: {
    type: String,
    required: true,
  },
  CommitMonth: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Commit", commitSchema);
