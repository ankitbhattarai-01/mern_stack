import expressAsyncHandler from "express-async-handler";
import Product, { CATEGORIES } from "../models/Product.js";
import {
  EXPIRY_STATUSES,
  getStatusCondition,
  getToday,
  parseDateOnly,
  withExpiryInfo,
} from "../utils/expiry.js";

// Checks the request body and returns clean data plus a list of any problems.
const validateProduct = (body = {}) => {
  const errors = [];
  const { name, category, quantity, expiryDate, description } = body;

  if (typeof name !== "string" || !name.trim()) {
    errors.push("Product name is required");
  }

  if (!CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(", ")}`);
  }

  const isNumeric =
    typeof quantity === "number" ||
    (typeof quantity === "string" && quantity.trim() !== "");
  const quantityValue = isNumeric ? Number(quantity) : NaN;
  if (!Number.isFinite(quantityValue) || quantityValue < 0) {
    errors.push("Quantity must be a number that is 0 or more");
  }

  const expiryValue = parseDateOnly(expiryDate);
  if (!expiryValue) {
    errors.push("Expiry date is required in YYYY-MM-DD format");
  }

  if (description != null && typeof description !== "string") {
    errors.push("Description must be text");
  }

  return {
    errors,
    data: {
      name,
      category,
      quantity: quantityValue,
      expiryDate: expiryValue,
      description: description ?? "",
    },
  };
};

// Treat the user's search as plain text so characters like ( or * are not regex syntax.
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Turns the URL's query string into a Mongoose filter.
const buildFilter = ({ search, category, status }) => {
  const filter = {};

  if (typeof search === "string" && search.trim()) {
    filter.name = { $regex: escapeRegex(search.trim()), $options: "i" };
  }

  if (category) {
    if (!CATEGORIES.includes(category)) {
      return { error: `Category must be one of: ${CATEGORIES.join(", ")}` };
    }
    filter.category = category;
  }

  if (status) {
    if (!EXPIRY_STATUSES.includes(status)) {
      return { error: `Status must be one of: ${EXPIRY_STATUSES.join(", ")}` };
    }
    Object.assign(filter, getStatusCondition(status));
  }

  return { filter };
};

// POST /api/products
export const createProduct = expressAsyncHandler(async (req, res) => {
  const { errors, data } = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(". ") });
  }

  const product = await Product.create(data);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    result: withExpiryInfo(product.toObject()),
  });
});

// GET /api/products?search=&category=&status=&sort=asc|desc
export const getProducts = expressAsyncHandler(async (req, res) => {
  const { filter, error } = buildFilter(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const direction = req.query.sort === "desc" ? -1 : 1;
  const products = await Product.find(filter)
    .sort({ expiryDate: direction, name: 1 })
    .lean();

  const today = getToday();
  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    count: products.length,
    result: products.map((product) => withExpiryInfo(product, today)),
  });
});

// GET /api/products/:id
export const getProductById = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    message: "Product retrieved successfully",
    result: withExpiryInfo(product),
  });
});

// PUT /api/products/:id
export const updateProduct = expressAsyncHandler(async (req, res) => {
  const { errors, data } = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(". ") });
  }

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    returnDocument: "after",
    runValidators: true,
    lean: true,
  });
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    result: withExpiryInfo(product),
  });
});

// DELETE /api/products/:id
export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
});
