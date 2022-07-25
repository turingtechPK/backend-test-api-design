
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { HomeworkModule } from './../src/homework/homework.module';
import { HomeworkService } from './../src/homework/homework.service';
import { INestApplication } from '@nestjs/common';

describe('homework', () => {
  let app: INestApplication;
  let homeworkService = { getNewContributors: () => [{
    organization: "facebook",
    repository: "react",
    year: "2013",
    month: "04",
      }] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HomeworkModule],
    })
      .overrideProvider(HomeworkService)
      .useValue(homeworkService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/`, () => {
    return request(app.getHttpServer())
      .get('/:org/:repo/:year/:?month')
      .query({ org: 'facebook' , repo: 'react' , year: '2013' , month: '04' })
      .expect(200)
      .expect({
        data: homeworkService.getNewContributors(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
