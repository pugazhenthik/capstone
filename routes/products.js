const router = require("express").Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const queries = {};
    const search = req.query.search;
    if (search) {
      queries.$or = [
        { title: { $regex: "(?i)" + search } },
        { description: { $regex: "(?i)" + search } },
      ];
    }

    const products = await Product.find(queries);

    if (!products) {
      res.status(200).json({ message: "No products." });
    }

    res.status(200).json({ data: products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.user);
    if (!user) {
      return res.status(404).json({ error: "User not found!." });
    }

    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(404).json({ error: "Category not found!." });
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

    await product.save();

    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res
      .status(200)
      .json({ message: "Product updated successfully.", data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ error: "Product not found!." });
    }

    res.status(200).json({ data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      res.status(404).json({ error: "Product not found!." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
