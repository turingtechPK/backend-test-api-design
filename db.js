const mongoose = require('mongoose');

// loading environment variables from .env file
require("dotenv").config();

// Define an async function to connect to MongoDB
async function connectDB() {
try {
// Use Mongoose to connect to the database specified in the .env file
await mongoose.connect(process.env.dburl, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
console.log('MongoDB connected successfully');
} catch (err) {
// If there is an error, log it to the console
console.log('Error connecting to MongoDB:', err.message);
}
}

// Export the connectDB function to other modules
module.exports = connectDB;
