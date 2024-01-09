const express = require('express')
const path = require("path");
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT
const routes = require('./routes/index')
const cors = require('cors');

connectDB()

const app = express()

app.use(cors());
app.use(express.json())

app.use('/api', routes)

app.listen(port, () => console.log(`Server running on port ${port}`))