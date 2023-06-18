import { Controller, Get, Param } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubApiParamsDto } from './dtos/get-params.dto';

@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Get('/:organization/:repository/:year/:month?')
  async getUniqueContributor(@Param() params: GithubApiParamsDto) {
    return this.githubService.getGithub(params);
  }
}
