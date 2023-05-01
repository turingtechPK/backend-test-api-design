const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// Set the port number for the server by defaulting to 5000 
const PORT = process.env.PORT || 5000;

const cors = require("cors");

//Establish a connection to the database
const connectDB = require('./db');
connectDB();

// Import the routes for handling API requests
const routes = require("./routes/apirequest");

app.use(bodyParser.json());
app.use(cors());

// Use the routes to handle incoming API requests
app.use(routes);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


