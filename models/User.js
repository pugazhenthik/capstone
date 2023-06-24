const mongoose = require("mongoose");

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
    isAdmin: {
      type: Boolean,
      defautl: false,
    },
    isUser: {
        type: Boolean,
        defautl: false,
      },
    isSeller: {
        type: Boolean,
        defautl: false,
      },    
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
