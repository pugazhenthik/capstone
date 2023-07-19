const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

exports.findAll = async (req, res) => {
  const queries = {};
  const search = req.body.search;
  if (search) {
    queries.$or = [
      { title: { $regex: "(?i)" + search } },
      { description: { $regex: "(?i)" + search } },
    ];
  }

  await Product.find(queries)
    .then((products) => {
      return res.status(200).json({ data: products });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.create = async (req, res) => {
  const user = await User.findById(req.body.user);
  if (!user) {
    return res.status(404).json({ error: "User not found." });
  }

  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(404).json({ error: "Category not found." });
  }

  const product = new Product({
    title: req.body.title,
    sku: req.body.sku,
    price: req.body.price,
    quantity: req.body.quantity,
    image: req.body.image,
    category: req.body.category,
    user: req.body.user,
    description: req.body.description,
  });

  await product
    .save()
    .then((product) => {
      res.status(200).json({ data: product });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Product not created.",
        error: err.message,
      });
    });
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  await Product.findById(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ error: "Product not found." });
      }
      return res.status(200).json({ data: product });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Product not found.",
        error: err.message,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Product.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not updated." });
      }

      return res
        .status(200)
        .json({ message: "Product updated successfully.", data: product });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Product not updated.",
        error: err.message,
      });
    });
};

exports.delete = async (req, res) => {
  let id = req.params.id;
  await Product.findByIdAndDelete(id)
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not deleted." });
      }
      return res.status(200).json({ message: "Product deleted successfully." });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Product not deleted.",
        error: err.message,
      });
    });
};
