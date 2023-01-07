const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment/moment')

const reposistorySchema = new Schema({
  repo: String,
  owner: String,
  updatedAt: Date,
  //firstCommits of each contributor
  firstCommits: {}, // {[userName]: Date}
})

//middleware to update updatedAt field
reposistorySchema.pre('save', function (next) {
  this.updatedAt = moment.utc().format('YYYY-MM-DD')
  next()
})

const Repository = mongoose.model('Repository', reposistorySchema)
module.exports = Repository
