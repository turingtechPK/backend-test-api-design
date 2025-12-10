import { getCommitsForYear, getUserFirstCommitDate } from "./github.service";
import {
  findOrCreateOrg,
  findOrCreateRepo,
  addContributor,
  getContributorStats,
  hasRepositoryData,
  hasRepositoryDataForYear,
} from "./database.service";

export const processRepository = async (
  org: string,
  repo: string,
  token?: string
) => {
  console.log(`Processing ${org}/${repo}...`);

  // Check if already processed
  const hasData = await hasRepositoryData(org, repo);
  if (hasData) {
    console.log(`Repository ${org}/${repo} already processed`);
    return;
  }

  // Setup database entries
  const organization = await findOrCreateOrg(org);
  const repository = await findOrCreateRepo(organization.id, repo);

  console.log(`Processed contributors for ${org}/${repo}`);
};

export const processRepositoryForYear = async (
  org: string,
  repo: string,
  year: number,
  token?: string
) => {
  console.log(`Processing ${org}/${repo} for year ${year}...`);

  // Setup database entries
  const organization = await findOrCreateOrg(org);
  const repository = await findOrCreateRepo(organization.id, repo);

  // Get commits for the specific year
  const commits = await getCommitsForYear(org, repo, year, token);
  console.log(
    `Fetched ${commits.length} commits for ${org}/${repo} in ${year}`
  );

  const contributors = new Map<string, Date>();

  // Track unique contributors and their first commit in this year
  for (const commit of commits) {
    const authorUser = commit.author?.login;
    const commitData = commit.commit;
    const dateStr = commitData?.author?.date || commitData?.committer?.date;

    if (!dateStr || !authorUser || isBot(authorUser)) continue;

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) continue;

    if (!contributors.has(authorUser) || contributors.get(authorUser)! > date) {
      contributors.set(authorUser, date);
    }
  }

  // For each contributor, check if this is their first commit ever in the repository
  for (const [username] of contributors) {
    const actualFirstCommit = await getUserFirstCommitDate(
      org,
      repo,
      username,
      token
    );

    if (actualFirstCommit) {
      // Only add if their first ever commit was in the requested year
      if (actualFirstCommit.getFullYear() === year) {
        await addContributor(repository.id, username, actualFirstCommit);
      }
    }
  }

  console.log(
    `Processed ${contributors.size} potential new contributors for ${org}/${repo} in ${year}`
  );
};

export const getStats = async (
  org: string,
  repo: string,
  year: number,
  month?: number,
  token?: string,
  page?: number,
  limit?: number
) => {
  try {
    console.log(`Getting contributors for ${org}/${repo} in ${year}`);

    // Setup database entries
    const organization = await findOrCreateOrg(org);
    const repository = await findOrCreateRepo(organization.id, repo);

    // Check if we already have data for this specific year
    const hasYearData = await hasRepositoryDataForYear(org, repo, year);

    if (!hasYearData) {
      // Get commits for the specific year
      const commits = await getCommitsForYear(org, repo, year, token);
      console.log(`Found ${commits.length} commits in ${year}`);

      const contributorsInYear = new Map<string, Date>();

      // Extract unique contributors and their earliest commit in this year
      for (const commit of commits) {
        const authorUser = commit.author?.login;
        const commitDate = new Date(commit.commit.author.date);

        if (authorUser && !isBot(authorUser) && !isNaN(commitDate.getTime())) {
          if (
            !contributorsInYear.has(authorUser) ||
            contributorsInYear.get(authorUser)! > commitDate
          ) {
            contributorsInYear.set(authorUser, commitDate);
          }
        }
      }

      // Save all contributors we found in this year
      for (const [username, firstCommitInYear] of contributorsInYear) {
        await addContributor(repository.id, username, firstCommitInYear);
      }

      console.log(`Saved ${contributorsInYear.size} contributors for ${year}`);
    }

    // Get the stats from database with pagination
    return await getContributorStats(
      org,
      repo,
      year,
      month,
      page || 1,
      limit || 10
    );
  } catch (error: any) {
    console.error("Error getting stats:", error.message);
    return {
      org,
      repository: repo,
      year: year.toString(),
      ...(month && { month: month.toString().padStart(2, "0") }),
      newContributors: 0,
    };
  }
};

const isBot = (username: string): boolean => {
  const botNames = ["web-flow", "dependabot", "renovate", "github-actions"];
  return botNames.some((bot) => username.toLowerCase().includes(bot));
};
