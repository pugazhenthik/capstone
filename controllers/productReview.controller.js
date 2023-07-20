const Product = require("../models/Product");
const User = require("../models/User");
const ProductReview = require("../models/ProductReview");

exports.findAll = async (req, res) => {
  const queries = {};
  if (req.params.id) {
    queries.product = req.params.id;
  }

  await ProductReview.find(queries)
    .then((reviews) => {
      res.status(200).json({ data: reviews });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.create = async (req, res) => {
  const productId = req.body.product;
  const userId = req.body.user;
  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required" });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required" });
  }

  await Product.findById(productId)
    .select(["_id"])
    .then((product) => {
      if (!product) {
        return res.status(422).json({ error: "Invalid Product!" });
      }
    });

  await User.findOne({ _id: userId, role: "user" })
    .select(["_id"])
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid user!" });
      }
    });

  const review = new ProductReview({
    body: req.body.body,
    rating: req.body.rating,
    product: productId,
    user: req.body.user,
  });

  await review
    .save()
    .then((review) => {
      return res
        .status(200)
        .json({ message: "Review added successfully!", data: review });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.findOne = async (req, res) => {
  let id = req.params.id;

  await ProductReview.findById(id)
    .then((reviews) => {
      res.status(200).json({ data: reviews });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.update = async (req, res) => {
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

  await Product.findOne({
    _id: productId,
  })
    .select(["_id"])
    .then((product) => {
      if (!product) {
        return res.status(422).json({ error: "Invalid product!" });
      }
    });

  await User.findOne({ _id: userId, role: "user" })
    .select(["_id"])
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid user!" });
      }
    });

  await ProductReview.findByIdAndUpdate(
    req.params.id,
    {
      body: req.body.body,
      rating: req.body.rating,
      product: productId,
      user: userId,
    },
    { new: true }
  )
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "Review not found!." });
      }
      return res
        .status(200)
        .json({ message: "Review updated successfully!", data: review });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

exports.delete = async (req, res) => {
  await ProductReview.findByIdAndDelete(req.params.id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "Review not found!." });
      }
      return res.status(200).json({ message: "Review deleted successfully." });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};
