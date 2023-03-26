import mongoose from "mongoose";

const Schema = mongoose.Schema;

const repositorySchema = new Schema({
  org: {
    type: String,
    required: true,
  },
  repository: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  newContributors: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("RepoDetail", repositorySchema);
