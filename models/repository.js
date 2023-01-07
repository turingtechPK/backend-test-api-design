const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reposistorySchema = new Schema({
  repo: String,
  owner: String,
  updatedAt: Date,
  //firstCommits of each contributor
  firstCommits: {}, // {[userName]: Date}
})

//middleware to update updatedAt field
reposistorySchema.pre('save', function (next) {
  this.updatedAt = Date.now()
  next()
})

const Repository = mongoose.model('Repository', reposistorySchema)
module.exports = Repository
