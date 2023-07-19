const Category = require("../models/Category");

exports.findAll = async (req, res) => {
  const queries = {};
  const search = req.body.search;
  if (search) {
    queries.$or = [
      { title: { $regex: "(?i)" + search } },
      { description: { $regex: "(?i)" + search } },
    ];
  }

  await Category.find(queries)
    .then((categories) => {
      return res.status(200).json({ data: categories });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.create = async (req, res) => {
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  await category
    .save()
    .then((category) => {
      res.status(200).json({ data: category });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Category not created",
        error: err.message,
      });
    });
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  await Category.findById(id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      return res.status(200).json({ data: category });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Category not found.",
        error: err.message,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      description: req.body.description,
    },
    { new: true }
  )
    .then((category) => {
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }

      return res
        .status(200)
        .json({ message: "Category updated successfully.", data: category });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Category not updated.",
        error: err.message,
      });
    });
};

exports.delete = async (req, res) => {
  let id = req.params.id;
  await Category.findByIdAndDelete(id)
    .then((category) => {
      if (!category) {
        return res.status(404).json({ message: "Category not found." });
      }
      return res
        .status(200)
        .json({ message: "Category deleted successfully." });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Category not deleted.",
        error: err.message,
      });
    });
};
