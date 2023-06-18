import get from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GITHUB_PROVIDER_TOKEN } from './github.constants';
import { IGithub } from './github.schema';
import { Model } from 'mongoose';

@Injectable()
export class GithubService {
  constructor(
    private configService: ConfigService,
    @Inject(GITHUB_PROVIDER_TOKEN) private githubModel: Model<IGithub>,
  ) {}
  async getGithub(paramObj) {
    const { organization, repository, year, month } = paramObj;
    const exists = await this.githubModel.findOne(paramObj, {
      _id: 0,
      organization: 1,
      repository: 1,
      year: 1,
      month: 1,
      newContributors: 1,
    });
    if (exists) {
      return exists;
    }

    const endDate = `${year}-12-31T23:59:59Z`;
    const url = `https://api.github.com/repos/${organization}/${repository}/commits?until=${endDate}`;
    const contributors = {};

    try {
      let page = 1;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await get(url, {
          params: {
            page,
            per_page: 100,
            until: `${endDate}`,
          },
          headers: {
            Accept: 'application/vnd.github.v3+json',
            Authorization: `Bearer ${this.configService.get(
              'github.githubToken',
            )}`,
          },
        });

        const remaining = parseInt(response.headers['x-ratelimit-remaining']);
        const resetTime = parseInt(response.headers['x-ratelimit-reset']);

        if (remaining === 0) {
          const now = new Date().getTime() / 1000;
          const waitTime = resetTime - now + 1;
          console.log(`Rate limit exceeded. Waiting ${waitTime} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime * 1000));
        }

        const commits = response.data;
        for (const commit of commits) {
          const contributorEmail = commit.commit.author.email;

          if (!this.isExistingContributor(contributorEmail, contributors)) {
            if (!contributors[contributorEmail]) {
              contributors[contributorEmail] = {
                firstCommitDate: commit.commit.committer.date,
                commitCount: 1,
              };
            }
          } else {
            if (
              commit.commit.author.date <
              contributors[contributorEmail].firstCommitDate
            ) {
              contributors[contributorEmail].firstCommitDate =
                commit.commit.author.date;
            }
            contributors[contributorEmail].commitCount++;
          }
        }

        if (commits.length === 100) {
          page++;
        } else {
          hasNextPage = false;
        }
      }
    } catch (error) {
      console.error('Error fetching new contributors:', error.message);
    }

    const filteredContributors = {};
    for (const contributor in contributors) {
      const { firstCommitDate, commitCount } = contributors[contributor];
      const date = new Date(firstCommitDate);
      const commitYear = date.getFullYear();
      const commitMonth = date.getMonth() + 1;
      if (
        commitYear === parseInt(year) &&
        (!month || commitMonth === parseInt(month))
      ) {
        filteredContributors[contributor] = { firstCommitDate, commitCount };
      }
    }
    let result = {};
    if (month) {
      result = {
        organization,
        repository,
        year,
        month,
        newContributors: Object.keys(filteredContributors).length,
      };
    } else
      result = {
        organization,
        repository,
        year,
        newContributors: Object.keys(filteredContributors).length,
      };
    await this.githubModel.create(result);
    console.log(result);
    return result;
  }

  isExistingContributor(email, contributors) {
    return Object.prototype.hasOwnProperty.call(contributors, email);
  }
}
