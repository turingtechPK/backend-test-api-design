const repository = require("../models/repository");

// Get data for a specific year
const getDataByYear = async (org, repo, year) => {
  try {
    const data = await repository.find({ org, repo, year });
    return data;
  } catch (error) {
    throw new Error("Failed to get data by year");
  }
};

// Get data for a specific month and year
const getDataByMonthAndYear = async (org, repo, year, month) => {
  try {
    const data = await repository.find({ org, repo, year, month });
    return data;
  } catch (error) {
    throw new Error("Failed to get data by month and year");
  }
};

// Save data to the database
const saveData = async (org, repo, year, month = null, newContributors) => {
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
