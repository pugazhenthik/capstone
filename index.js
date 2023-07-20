const express = require("express");
const app = express();
const dotenv = require("dotenv");
// const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const sellerReviewRoutes = require("./routes/sellerReview.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const productReviewRoutes = require("./routes/productReview.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

dotenv.config();
// app.use(cors(corsOptions));

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

app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers/:serllerId/reviews", sellerReviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products/:productId/reviews", productReviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(3000, () => {
  console.log("Server is running...");
});
