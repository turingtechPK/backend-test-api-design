const request = require('supertest');
const app = require('../app'); 
const mongoose = require('mongoose');
const Contributor = require('../models/Contributor'); 

describe('API Endpoints', () => {
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  
  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('GET /api/org/repo/year/month - fetch new contributors', async () => {
    
    const response = await request(app).get('/api/facebook/react/2020/06'); 

   
    expect(response.statusCode).toBe(200);
    
  },1000000);

  
});
