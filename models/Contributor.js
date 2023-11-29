const mongoose = require('mongoose');

const ContributorSchema = new mongoose.Schema({
  org: String,
  repository: String,
  year: Number,
  month: Number,
  newContributors: [{ type: String }]
});
ContributorSchema.index({ org: 1, repository: 1, year: 1, month: 1 }, { unique: true });
module.exports = mongoose.model('Contributor', ContributorSchema);
