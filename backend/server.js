import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import {
  errorHandler,
  notFound,
  requireDatabase,
} from "./middleware/errorMiddleware.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import productRouter from "./routes/productRoutes.js";

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const app = express();

// Middleware runs in order for every request, so this order matters.
app.use(cors({ origin: CLIENT_URL })); // let the React app call this API
app.use(express.json()); // put JSON request data into req.body

app.get("/api", (req, res) => {
  res.json({ success: true, message: "ExpiryAlert API is running" });
});

app.use("/api", requireDatabase);
app.use("/api/products", productRouter);
app.use("/api/dashboard", dashboardRouter);

// These two must stay last so they only run when nothing above responded.
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Could not connect to MongoDB: ${error.message}`);
    process.exit(1);
  }

  // In Express 5, startup problems such as a busy port arrive in this callback.
  app.listen(PORT, (error) => {
    if (error) {
      console.error(`Could not start server: ${error.message}`);
      process.exit(1);
    }
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();
