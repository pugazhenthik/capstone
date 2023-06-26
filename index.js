const express = require("express");
const app = express();

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const sellerReviewRoutes = require("./routes/sellerReviews");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/products");
const productReviewRoutes = require("./routes/productReviews");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected..");
  })
  .catch((error) => {
    console.log("DB not connected " + error);
  });

app.use(express.json());

app.get("/api", (req, res) => {
  res.send("hello there");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers/reviews", sellerReviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products/reviews", productReviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server is running...");
});
