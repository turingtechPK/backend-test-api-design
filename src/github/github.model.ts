import { Connection } from 'mongoose';
import { GITHUB_COLLECTION, GITHUB_PROVIDER_TOKEN } from './github.constants';
import { GithubSchema } from './github.schema';
import { CONNECTION_PROVIDER } from 'src/database/database.constants';

export const GithubModel = [
  {
    provide: GITHUB_PROVIDER_TOKEN,
    useFactory: async (connection: Connection) =>
      connection.model(GITHUB_COLLECTION, GithubSchema),
    inject: [CONNECTION_PROVIDER],
  },
];
