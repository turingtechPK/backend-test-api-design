import express, { Express } from 'express';
import cors from 'cors';

import { connectDB } from "./config/db"

const app: Express = express();

app.use(cors({ origin: '*' }));

connectDB();


export { app };