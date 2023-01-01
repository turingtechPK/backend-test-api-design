const config = {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
  },
};

module.exports = config;
