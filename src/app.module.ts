import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeworkController } from './homework/homework.controller';
import { HomeworkModule } from './homework/homework.module';
import { HomeworkService } from './homework/homework.service';

@Module({
  imports: [HomeworkModule],
  controllers: [AppController, HomeworkController],
  providers: [AppService, HomeworkService],
})
export class AppModule {}
