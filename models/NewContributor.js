const mongoose = require("mongoose");

const githubSchema = new mongoose.Schema(
    {
        title : {type: String, required: true},
        courseNo : {type: Number, required: true},
        theoryCredits: {type: Number},
        labCredits: {type: Number},
        degree: {type: String},
        department: {type: String},
        program: {type: String}
    },
    {timestamps: true}
);

module.exports = mongoose.model("Course", CourseSchema)