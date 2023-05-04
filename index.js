const express = require("express");
const repositoryRoutes = require("./routes/repositoryRoutes");
const { connectDb } = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDb();

// API routes
app.use("/", repositoryRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
