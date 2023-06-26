const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  primary: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    last_name: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "seller", "user"],
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
