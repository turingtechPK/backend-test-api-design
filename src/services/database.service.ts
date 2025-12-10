import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async () => {
  await prisma.$connect();
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};

export const findOrCreateOrg = async (name: string) => {
  return await prisma.organization.upsert({
    where: { name },
    update: {},
    create: { name },
  });
};

export const findOrCreateRepo = async (orgId: string, name: string) => {
  return await prisma.repository.upsert({
    where: {
      organizationId_name: {
        organizationId: orgId,
        name,
      },
    },
    update: {},
    create: {
      name,
      organizationId: orgId,
    },
  });
};

export const addContributor = async (
  repositoryId: string,
  username: string,
  firstCommitDate: Date
) => {
  if (isNaN(firstCommitDate.getTime())) {
    console.warn(`Invalid date for contributor ${username}, skipping`);
    return;
  }

  // Check if contributor already exists
  const existing = await prisma.contributor.findUnique({
    where: {
      repositoryId_username: {
        repositoryId,
        username,
      },
    },
  });

  if (!existing) {
    await prisma.contributor.create({
      data: {
        repositoryId,
        username,
        firstCommit: firstCommitDate,
      },
    });
  } else {
    // If existing contributor has a later first commit date, update it
    if (existing.firstCommit > firstCommitDate) {
      await prisma.contributor.update({
        where: {
          repositoryId_username: {
            repositoryId,
            username,
          },
        },
        data: {
          firstCommit: firstCommitDate,
        },
      });
    }
  }
};

export const getContributorStats = async (
  org: string,
  repo: string,
  year: number,
  month?: number,
  page: number = 1,
  limit: number = 10
) => {
  const startDate = month ? new Date(year, month - 1, 1) : new Date(year, 0, 1);

  const endDate = month
    ? new Date(year, month, 0, 23, 59, 59)
    : new Date(year, 11, 31, 23, 59, 59);

  console.log(`Filtering contributors between ${startDate} and ${endDate}`);

  const whereClause = {
    repository: {
      name: repo,
      organization: { name: org },
    },
    firstCommit: {
      gte: startDate,
      lte: endDate,
    },
  };

  // Get total count
  const totalContributors = await prisma.contributor.count({
    where: whereClause,
  });

  // Get paginated contributors
  const contributors = await prisma.contributor.findMany({
    where: whereClause,
    select: {
      username: true,
      firstCommit: true,
      createdAt: true,
    },
    orderBy: {
      firstCommit: "asc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalPages = Math.ceil(totalContributors / limit);

  console.log(
    `Found ${totalContributors} contributors for ${year}, showing page ${page}/${totalPages}`
  );

  return {
    org,
    repository: repo,
    year: year.toString(),
    ...(month && { month: month.toString().padStart(2, "0") }),
    newContributors: totalContributors,
    contributors: contributors.map((c) => ({
      username: c.username,
      firstCommit: c.firstCommit,
    })),
    pagination: {
      currentPage: page,
      totalPages,
      totalContributors,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

export const hasRepositoryData = async (org: string, repo: string) => {
  try {
    const count = await prisma.contributor.count({
      where: {
        repository: {
          name: repo,
          organization: { name: org },
        },
      },
    });
    return count > 0;
  } catch (error) {
    console.error("Error in hasRepositoryData:", error);
    throw error;
  }
};

export const hasRepositoryDataForYear = async (
  org: string,
  repo: string,
  year: number
) => {
  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const count = await prisma.contributor.count({
      where: {
        repository: {
          name: repo,
          organization: { name: org },
        },
        firstCommit: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return count > 0;
  } catch (error) {
    console.error("Error in hasRepositoryDataForYear:", error);
    throw error;
  }
};
