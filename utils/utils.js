//In this file, I am preparing the url for api call, which includes assigning it my own github token
const myValues = require("./githubValues");
require("dotenv/config");

module.exports.generateOptions = (_path) => {
  return (options = {
    hostname: myValues.hostname,
    path: _path,
    headers: {
      //"Authorization":process.env.MY_TOKEN,
      authorization: "token " + process.env.MY_TOKEN,
      "User-Agent": myValues.user_agent,
      "Content-Type": "application/json",
    },
    OAUth: process.env.MY_TOKEN,
  });
};
