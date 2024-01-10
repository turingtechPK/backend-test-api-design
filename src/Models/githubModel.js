import mongoose from 'mongoose';

const contributorSchema = new mongoose.Schema({
  login: String,
  id: Number,
  node_id: String,
  avatar_url: String,
  gravatar_id: String,
  url: String,
  html_url: String,
  followers_url: String,
  following_url: String,
  gists_url: String,
  starred_url: String,
  subscriptions_url: String,
  organizations_url: String,
  repos_url: String,
  events_url: String,
  received_events_url: String,
  type: String,
  site_admin: Boolean,
  contributions: Number,
});

const githubDataSchema = new mongoose.Schema({
  org: String,
  repository: String,
  year: String,
  month: String,
  newContributors: [contributorSchema],
});

const GithubData = mongoose.model('GithubData', githubDataSchema);
export default GithubData;
