import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GithubApiParamsDto {
  @IsNotEmpty()
  @IsString()
  organization: string;

  @IsNotEmpty()
  @IsString()
  repository: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsOptional()
  @IsString()
  month: string;
}
