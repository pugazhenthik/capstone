const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
  body: {
    type: String,
    required: true,
    max: 2000,
  },
  rating: {
    type: Number,
    default: 0,
    max: 5,
  },
  product: {
    type: mongoose.ObjectId,
    ref: "Product",
  },
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Product_Reviews", reviewSchema);
