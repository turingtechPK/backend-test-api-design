const express = require("express");
const fetchDataMiddleware = require("../middleware/fetchDataMiddleware");

// Initialize the router
const router = express.Router();

// Define the route
// The paramters are org, repo, year, and month
// The month is optional
router.get(
  "/:org/:repo/:year/:month?",
  fetchDataMiddleware,
  async (req, res) => {
    res.status(200).json(req.data);
  }
);

// Export the router
module.exports = router;
