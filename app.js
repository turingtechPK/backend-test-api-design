const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const ReposRouter = require('./routes/ReposRouter');

const app = express();
const whitelist = ['http://localhost:3000', 'http://localhost:5500', 'http://localhost:8000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// Middlewares uesd
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routers
app.use('/github', ReposRouter);

module.exports = app;
