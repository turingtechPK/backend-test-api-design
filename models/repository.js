const { mongoose } = require('../utils/packages');

const repositorySchema = mongoose.Schema({
    name: {
        type: String,
    },
    full_name: {
        type: String,
    },
    owner: {
        login: {
            type: String,
        },
        type: {
            type: String,
        },
    },
    description: {
        type: String,
    },
    private: {
        type: Boolean,
    },
    default_branch: {
        type: String,
    },
    create_at: {
        type: Date,
    },
    commits_url: {
        type: String,
    },
    contributors_url: {
        type: String,
    },
    // array of objects of new contributors... each object contains the username 
    // of the new contributor and the date/year of the first commit...
    // newContributors: [{
    //     username: { type: String },
    //     firstCommit: { type: String }
    // }]
}, { versionKey: false });

module.exports = mongoose.model("Repository", repositorySchema);