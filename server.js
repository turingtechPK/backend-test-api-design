import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import routes from "./routes/index.js";
import mongoose from "mongoose";
import { createError } from "./utils/errors.js";
dotenv.config();

const app = express();

// database connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected.");
  } catch (error) {
    console.log(error.message);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Database disconnected.");
});

// middlewares
app.use(express.json());
app.use(cors());
app.use("/", routes); //api

// error handling middlware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong.";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connect();
  console.log(`Port listening at ${PORT}`);
});
