const repository = require("../models/repository");

// Get data for a specific year and optionally a specific month
const getData = async (org, repo, year, month = null) => {
  // Check if the parameters are valid
  if (!org || typeof org !== "string")
    return {
      error: "Invalid organization name",
    };
  if (!repo || typeof repo !== "string")
    return {
      error: "Invalid repository name",
    };
  if (!year || typeof year !== "number")
    return {
      error: "Invalid year",
    };
  if (month && typeof month !== "number")
    return {
      error: "Invalid month",
    };

  try {
    // Construct the query and add the month if it was specified
    const query = { org, repo, year };
    if (month) query.month = month;

    const data = await repository.findOne(query);

    return {
      data: data,
    };
  } catch (error) {
    return {
      error: `Failed to get data: ${error.message}`,
    };
  }
};

// Save the data to the database
const saveData = async (org, repo, year, month = null, newContributors) => {
  // Check if the parameters are valid
  if (!org || typeof org !== "string")
    return {
      error: "Invalid organization name",
    };
  if (!repo || typeof repo !== "string")
    return {
      error: "Invalid repository name",
    };
  if (!year || typeof year !== "number")
    return {
      error: "Invalid year",
    };
  if (month && typeof month !== "number") return { error: "Invalid month" };
  if (typeof newContributors !== "number")
    return {
      error: "Invalid number of new contributors",
    };

  if (!month) month = 0;
  try {
    const data = await repository.create({
      org,
      repo,
      year,
      month,
      newContributors,
    });
    return {
      data: data,
    };
  } catch (error) {
    return {
      error: `Failed to save data: ${error.message}`,
    };
  }
};

// Export the functions
module.exports = {
  getData,
  saveData,
};
