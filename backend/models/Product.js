import mongoose from "mongoose";

export const CATEGORIES = [
  "Food",
  "Dairy",
  "Beverages",
  "Medicine",
  "Cosmetics",
  "Household",
  "Other",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: "{VALUE} is not a valid category",
      },
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
  },
  // timestamps makes Mongoose manage createdAt and updatedAt automatically.
  { timestamps: true },
);

// Mongoose stores the "Product" model in the "products" collection.
const Product = mongoose.model("Product", productSchema);

export default Product;
