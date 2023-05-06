require("dotenv").config(); // Load environment variables from .env file

// Initialize Express
const express = require("express");
const app = express();

// Initialize the router
const router = require("./src/routes/router");
app.use(router);

// Connect to the database
const connectToDatabase = require("./src/config/db");
connectToDatabase();

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}...`));
