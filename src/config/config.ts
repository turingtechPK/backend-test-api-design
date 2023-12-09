import * as dotenv from 'dotenv';

dotenv.config();

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;
const GITHUB_TOKEN: string = process.env.GITHUB_TOKEN as string;
const MONGO_URI: string = process.env.MONGO_URI as string;

export { PORT, GITHUB_TOKEN, MONGO_URI };
