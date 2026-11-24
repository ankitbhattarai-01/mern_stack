import expressAsyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import {
  getStatusCondition,
  getToday,
  withExpiryInfo,
} from "../utils/expiry.js";

// How many products each dashboard section lists.
const SECTION_LIMIT = 5;

const findProducts = async (filter, sort, today) => {
  const products = await Product.find(filter)
    .sort(sort)
    .limit(SECTION_LIMIT)
    .lean();

  return products.map((product) => withExpiryInfo(product, today));
};

// GET /api/dashboard/stats
export const getStats = expressAsyncHandler(async (req, res) => {
  const today = getToday();

  // Promise.all runs the four counts at the same time.
  const [total, expired, expiringSoon, safe] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments(getStatusCondition("Expired", today)),
    Product.countDocuments(getStatusCondition("Expiring Soon", today)),
    Product.countDocuments(getStatusCondition("Safe", today)),
  ]);

  res.status(200).json({
    success: true,
    message: "Dashboard statistics retrieved successfully",
    result: { total, expired, expiringSoon, safe },
  });
});

// GET /api/dashboard/expiring - products expiring soonest first
export const getExpiringProducts = expressAsyncHandler(async (req, res) => {
  const today = getToday();
  const result = await findProducts(
    getStatusCondition("Expiring Soon", today),
    { expiryDate: 1, name: 1 },
    today,
  );

  res.status(200).json({
    success: true,
    message: "Expiring products retrieved successfully",
    result,
  });
});

// GET /api/dashboard/expired - most recently expired first
export const getExpiredProducts = expressAsyncHandler(async (req, res) => {
  const today = getToday();
  const result = await findProducts(
    getStatusCondition("Expired", today),
    { expiryDate: -1, name: 1 },
    today,
  );

  res.status(200).json({
    success: true,
    message: "Expired products retrieved successfully",
    result,
  });
});

// GET /api/dashboard/recent - newest products first
export const getRecentProducts = expressAsyncHandler(async (req, res) => {
  const result = await findProducts({}, { createdAt: -1, _id: -1 }, getToday());

  res.status(200).json({
    success: true,
    message: "Recent products retrieved successfully",
    result,
  });
});
