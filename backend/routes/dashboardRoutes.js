import { Router } from "express";
import {
  getExpiredProducts,
  getExpiringProducts,
  getRecentProducts,
  getStats,
} from "../controllers/dashboardController.js";

const dashboardRouter = Router();

// These paths are all under /api/dashboard
dashboardRouter.get("/stats", getStats);
dashboardRouter.get("/expiring", getExpiringProducts);
dashboardRouter.get("/expired", getExpiredProducts);
dashboardRouter.get("/recent", getRecentProducts);

export default dashboardRouter;
