const mongoose = require("mongoose");

async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true, // Use new URL parser instead of deprecated one
      useUnifiedTopology: true, // Use new Server Discover and Monitoring engine instead of deprecated one
    });
    console.log("Connected to database.");
  } catch (error) {
    console.log("Error connecting to database: ", error);
    process.exit(1); // Exit with failure
  }
}

module.exports = connectToDatabase;
