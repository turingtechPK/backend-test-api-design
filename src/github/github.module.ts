import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { GithubModel } from './github.model';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [GithubController],
  providers: [GithubService, ...GithubModel],
})
export class GithubModule {}
