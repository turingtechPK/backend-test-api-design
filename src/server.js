import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import githubController from './Controllers/githubController.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';

// Loading environment variables from .env file
dotenv.config();

connectDB();

// Initializing Express application
const app = express();

// Parsing incoming JSON requests
app.use(express.json());

// Default route to check if the API is running
app.get('/', (req, res) => {
  res.send('Api is running...');
});

app.use('/api', githubController);

// Handling Documentation
const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;

// Starting the server and log the port and environment
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
