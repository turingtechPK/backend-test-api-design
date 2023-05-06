const repository = require("../models/repository");

// Get data for a specific year
const getDataByYear = async (org, repo, year) => {
  // Check if the parameters are valid
  if (!org || typeof org !== "string")
    throw new Error("Invalid organization name");

  if (!repo || typeof repo !== "string")
    throw new Error("Invalid repository name");

  if (!year || typeof year !== "number") throw new Error("Invalid year");

  try {
    const data = await repository.find({ org, repo, year });
    return data;
  } catch (error) {
    throw new Error("Failed to get data by year");
  }
};

// Get data for a specific month and year
const getDataByMonthAndYear = async (org, repo, year, month) => {
  // Check if the parameters are valid
  if (!org || typeof org !== "string")
    throw new Error("Invalid organization name");

  if (!repo || typeof repo !== "string")
    throw new Error("Invalid repository name");

  if (!year || typeof year !== "number") throw new Error("Invalid year");

  if (!month || typeof month !== "number") throw new Error("Invalid month");

  try {
    const data = await repository.find({ org, repo, year, month });
    return data;
  } catch (error) {
    throw new Error("Failed to get data by month and year");
  }
};

// Save data to the database
const saveData = async (org, repo, year, month = null, newContributors) => {
  // Check if the parameters are valid
  if (!org || typeof org !== "string")
    throw new Error("Invalid organization name");

  if (!repo || typeof repo !== "string")
    throw new Error("Invalid repository name");

  if (!year || typeof year !== "number") throw new Error("Invalid year");

  if (month && typeof month !== "number") throw new Error("Invalid month");

  if (!newContributors || typeof newContributors !== "number")
    throw new Error("Invalid number of new contributors");

  try {
    const data = await repository.create({
      org,
      repo,
      year,
      month,
      newContributors,
    });
    return data;
  } catch (error) {
    throw new Error("Failed to save data");
  }
};

// Export the functions
module.exports = {
  getDataByYear,
  getDataByMonthAndYear,
  saveData,
};
