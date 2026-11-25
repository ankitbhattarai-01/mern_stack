import mongoose from "mongoose";

// Runs before the API routes. Without it, a request made while MongoDB is down
// would hang for 10 seconds before failing.
export const requireDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
    return res.status(503).json({
      success: false,
      message: "The database is unavailable. Please try again shortly.",
    });
  }
  next();
};

export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Express recognises an error handler by its four parameters, so "next" must
// stay in the list even though it is not used.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: `Invalid product ID: ${err.value}` });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(". ");
    return res.status(400).json({ success: false, message });
  }

  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ success: false, message: "Request body is not valid JSON" });
  }

  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: "Something went wrong on the server",
  });
};
