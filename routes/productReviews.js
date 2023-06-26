const Product = require("../models/Product");
const ProductReview = require("../models/ProductReview");
const User = require("../models/User");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const productId = req.body.product;
  const userId = req.body.user;
  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required" });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required" });
  }

  try {
    const product = await Product.findById(productId).select(["_id"]);

    if (!product) {
      return res.status(422).json({ error: "Invalid Product!" });
    }

    const user = await User.findOne({ _id: userId, role: "user" }).select([
      "_id",
    ]);
    if (!user) {
      return res.status(422).json({ error: "Invalid user!" });
    }

    const review = new ProductReview({
      body: req.body.body,
      rating: req.body.rating,
      product: productId,
      user: req.body.user,
    });

    await review.save();

    res
      .status(200)
      .json({ message: "Review added successfully!", data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id?", async (req, res) => {
  try {
    const queries = {};
    if (req.params.id) {
      queries.seller = req.params.id;
    }
    const reviews = await ProductReview.find(queries);

    if (!reviews.length) {
      res.status(200).json({ message: "No reviews!", data: [] });
    }

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.put("/:reviewId", async (req, res) => {
  const productId = req.body.product;
  const userId = req.body.user;
  if (productId === userId) {
    return res.status(422).json({ error: "Self review is restricted" });
  }

  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required" });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required" });
  }

  try {
    const product = await Product.findOne({
      _id: productId,
    }).select(["_id"]);
    if (!product) {
      return res.status(422).json({ error: "Invalid product!" });
    }

    const user = await User.findOne({ _id: userId, role: "user" }).select([
      "_id",
    ]);
    if (!user) {
      return res.status(422).json({ error: "Invalid user!" });
    }

    const review = await ProductReview.findByIdAndUpdate(
      req.params.reviewId,
      {
        body: req.body.body,
        rating: req.body.rating,
        product: productId,
        user: userId,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found!." });
    }

    res
      .status(200)
      .json({ message: "Review updated successfully!", data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    const review = await ProductReview.findByIdAndDelete(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found!." });
    }

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
