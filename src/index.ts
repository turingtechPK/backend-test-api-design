import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/contributors.route";
import { connectDB } from "./services/database.service";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Error handling
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(error);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
