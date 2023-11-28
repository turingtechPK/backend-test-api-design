const request = require('supertest');
const app = require('../app'); // Adjust the path to your Express app
const mongoose = require('mongoose');
const Contributor = require('../models/Contributor'); // Adjust the path to your Mongoose model

describe('API Endpoints', () => {
  // Before all tests run, connect to the database
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // After all tests run, close the database connection
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/org/repo/year/month - fetch new contributors', async () => {
    // Here you should set up any necessary mock data in the database

    // Make a request to your endpoint
    const response = await request(app).get('/api/facebook/react/2020/06'); // Adjust the endpoint as necessary

    // Assertions
    expect(response.statusCode).toBe(200);
    // Add more assertions based on your expected response structure
  },1000000);

  // Add more tests for other endpoints
});
