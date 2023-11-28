require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

module.exports = app; // Export the app instance
