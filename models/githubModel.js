const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const githubSchema = new Schema({
  org: { type: String, required: true },
  repository: { type: String, required: true },
  year: { type: Number, required: true },
  month: { type: Number },
  new_contributors: [{ type: String }]
});

module.exports = mongoose.model('contributors', githubSchema)