const { mongoose } = require('../utils/packages');

const newContributor = mongoose.Schema({
    org: {
        type: String
    },
    reponame: {
        type: String
    },
    year: {
        type: String
    },
    numOfNewContributors: {
        type: Number,
        default: 0
    } 
}, { versionKey: false });

module.exports = mongoose.model("Contributor", newContributor);