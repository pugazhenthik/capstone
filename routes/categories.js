const router = require("express").Router();
const Category = require("../models/Category");

router.get("/", async (req, res) => {
  try {
    const queries = {};

    if (req.query.search) {
      queries.$or = [
        { name: { $regex: "(?i)" + req.query.search } },
        { description: { $regex: "(?i)" + req.query.search } },
      ];
    }

    const categories = await Category.find(queries);
    if (!categories) {
      return res.status(200).json({ message: "No categories.", data: [] });
    }

    res.status(200).json({ data: categories });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(422).json({ error: "Name is required." });
    }

    if (!req.body.description) {
      return res.status(422).json({ error: "Description is required." });
    }

    const isUnique = await Category.findOne({
      name: req.body.name,
    }).select(["id"]);

    if (isUnique) {
      return res.status(422).json({ error: "Category already exist." });
    }

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    await category.save();

    res.status(200).json({ data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ error: "Category not updated." });
    }

    res
      .status(200)
      .json({ message: "Category updated successfully.", data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ error: "Category not found!." });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (category) {
      return res
        .status(200)
        .json({ message: "Category deleted successfully." });
    }

    res.status(404).json({ error: "Category not found!." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
