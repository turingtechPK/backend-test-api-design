import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  //Endpoint for NewCommitters in a given Year
  @Get(':orgName/:repoName/:year')
  async getUniqueRepositoryCommitsInYear(
    @Param('orgName') orgName: string,
    @Param('repoName') repoName: string,
    @Param('year') year: string,
  ): Promise<any> {
    const commits = await this.githubService.getUniqueRepositoryCommitsInYear(
      orgName,
      repoName,
      year
    );
    return commits;
  }

  //Endpoint for NewCommitters in a given Year and Month
  @Get(':orgName/:repoName/:year/:month')
  async getUniqueRepositoryCommitsInYearAndMonth(
    @Param('orgName') orgName: string,
    @Param('repoName') repoName: string,
    @Param('year') year: string,
    @Param('month') month: string,

  ): Promise<any> {
    const commits = await this.githubService.getUniqueRepositoryCommitsInYearAndMonth(
      orgName,
      repoName,
      year,
      month
    );
    return commits;
  }
}
