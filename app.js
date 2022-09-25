const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
//GIT Related Imports
const { makeGitHeader } = require("./middlewares/githubHeader");
const gitRoute = require("./routes/gitRoutes");
const rateLimit = require("express-rate-limit");
//Importing my enviornment file, it contains URL to my Database, MY GIT Token & the port no of the app
require("dotenv/config");

//Declring a Single Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 20, // 20 Requests in a 10 minute window
  message: "Request limit exceeded!",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  //legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//Executing Express
const app = express();
//Getting my port from enviornment, else 8080 is used as default
const port = 8080 || process.env.PORT;
//Connecting to MongoDB where I will store my data
const connect = mongoose
  .connect(process.env.DB_CON, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Local MongoDB"))
  .catch(console.error);

//DB Diconnect Listner
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Diconnected");
});
//Middlewares
app.use(express.json());
app.use(cors());
app.use(makeGitHeader); //To make a git api compatible header which includes, requirement as per documentation
app.use(limiter); //Using the limiter I defined above

//to direct request to my routes
app.use("/turingGitApi", gitRoute);

//Error Handling
app.use((err, req, res) => {
  const errCode = err.status || 500;
  const errMessage = err.message || "Default Error";

  return res.status(errCode).json({
    success: false,
    status: errCode,
    message: errMessage,
  });
});

app.listen(port, () => console.log(`My Server is on port ${port}.`));
