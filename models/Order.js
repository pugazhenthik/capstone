const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
});

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.ObjectId,
      ref: "User",
    },
    tax: { type: Number },
    subtotal: { type: Number },
    total: { type: Number },
    payment: { type: String },
    address: addressSchema,
    items: [itemSchema],
    status: {
      type: String,
      default: "cart",
      enum: [
        "cart",
        "checkout", // order placed
        "confirm", // seller confirmed
        "processing",
        "shipped",
        "deliverd",
        "cancel",
        "refund",
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", orderSchema);
