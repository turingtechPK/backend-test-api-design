const mongoose = require("mongoose");

const NewContributorSchema = new mongoose.Schema(
    {
        org : {type: String, required: true},
        repository : {type: String, required: true},
        year: {type: String, required: true},
        month: {type: String},
        newContributors: {type: Number, required: true}
    },
    {timestamps: true}
);

module.exports = mongoose.model("NewContributor", NewContributorSchema)