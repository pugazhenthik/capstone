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
  seller: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  user: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Seller_Reviews", reviewSchema);
