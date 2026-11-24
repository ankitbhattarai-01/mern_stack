import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is missing from the backend .env file");
  }

  // Give up after 5 seconds instead of waiting if MongoDB is not running.
  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`MongoDB connected: ${connection.connection.name}`);
};

export default connectDB;
