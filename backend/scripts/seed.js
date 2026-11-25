// TEST DATA ONLY. Adds sample products so the app can be demonstrated.
//   npm run seed            replaces the sample products
//   npm run seed -- --clear removes the sample products
// Your own products are never touched: only records whose description starts
// with the marker below are removed.

import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import { addDays, getToday } from "../utils/expiry.js";

const MARKER = "[TEST DATA]";

// [name, category, quantity, days until expiry, description]
const samples = [
  ["Fresh Milk 1L", "Dairy", 6, -2, "Kept in the top fridge shelf"],
  ["Cough Syrup", "Medicine", 1, -12, "Opened bottle"],
  ["Sliced Bread", "Food", 2, -1, "Whole wheat"],
  ["Greek Yogurt", "Dairy", 4, 0, "Plain, 500g tub"],
  ["Orange Juice", "Beverages", 3, 3, "No added sugar"],
  ["Paracetamol 500mg", "Medicine", 20, 7, "Strip of tablets"],
  ["Basmati Rice 5kg", "Food", 1, 240, "Sealed bag"],
  ["Sunscreen SPF 50", "Cosmetics", 1, 60, "Daily use"],
  ["Dish Soap", "Household", 2, 400, "Lemon scent"],
  ["Green Tea", "Beverages", 25, 150, "Box of tea bags"],
  ["Batteries AA", "Other", 8, 900, "Pack of eight"],
];

const run = async () => {
  await connectDB();

  const { deletedCount } = await Product.deleteMany({
    description: { $regex: "^\\[TEST DATA\\]" },
  });
  console.log(`Removed ${deletedCount} sample products`);

  if (!process.argv.includes("--clear")) {
    const today = getToday();
    await Product.insertMany(
      samples.map(([name, category, quantity, days, description]) => ({
        name,
        category,
        quantity,
        expiryDate: addDays(today, days),
        description: `${MARKER} ${description}`,
      })),
    );
    console.log(`Added ${samples.length} sample products`);
  }

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
