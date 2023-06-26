const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 3,
      max: 200,
    },
    sku: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    image: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
