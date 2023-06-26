const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 200,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Category", categorySchema);
