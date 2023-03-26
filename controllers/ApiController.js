import axios from "axios";
import RepositoryModel from "../models/RepositoryModel.js";

const apiController = {
  async getUsers(req, res, next) {
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    const orgName = req.params.org || "facebook";

    try {
      const response = await axios.get(
        `https://api.github.com/orgs/${orgName}/repos`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      const repos = response.data;
      console.log(`Found ${repos.length} repositories for ${orgName}`);

      // Store results in an object
      const results = {};

      // Process each repository
      for (const repo of repos) {
        const repoName = repo.name;
        const createdDate = new Date(repo.created_at);

        const contributorsResponse = await axios.get(
          `https://api.github.com/repos/${orgName}/${repoName}/contributors`,
          {
            headers: {
              Authorization: `token ${accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        const contributors = contributorsResponse.data;

        console.log(
          `Found ${contributors.length} new contributors for ${orgName}/${repoName}`
        );

        // Create new instance of RepositoryModel and save to database
        const repository = new RepositoryModel({
          org: orgName,
          repository: repoName,
          year: createdDate.getFullYear(),
          newContributors: contributors.length,
        });
        await repository.save();

        // Add repository data to results object
        results[repoName] = {
          org: orgName,
          repository: repoName,
          year: createdDate.getFullYear(),
          newContributors: contributors.length,
        };
      }

      res.status(200).json({ results });
    } catch (error) {
      console.error(`Error fetching data for ${orgName}:`, error.message);

      next(error);
      //   res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default apiController;
