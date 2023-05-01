const mongoose = require("mongoose");

// Defining the schema for the contributors 
const contributorSchema = new mongoose.Schema({
Organization: { type: String, default: "" },
Repository: { type: String, default: "" },
Year: { type: Number,default: null},
Month: { type: Number, default: null },
NewContributors: { type: Array, default: [] },
});

// Create the Contributors model using defined schema
const Contributors = mongoose.model('Contributors', contributorSchema);

// Export the Contributors model to use when saving
module.exports = Contributors;