import { Router } from "express";
import {
  getYearlyContributors,
  getMonthlyContributors,
} from "../controllers/contributors.controller";
import { validateParams } from "../middleware/validation";

const router = Router();

// API Info
router.get("/", (req, res) => {
  res.json({
    name: "GitHub Contributors API",
    version: "1.0.0",
    endpoints: {
      "GET /:org/:repo/:year": "Get yearly new contributors",
      "GET /:org/:repo/:year/:month": "Get monthly new contributors",
    },
  });
});

// Routes
router.get("/:org/:repo/:year", validateParams, getYearlyContributors);
router.get("/:org/:repo/:year/:month", validateParams, getMonthlyContributors);

export default router;
