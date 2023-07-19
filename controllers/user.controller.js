const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.findAll = async (req, res) => {
  const queries = {};
  const search = req.body.search;
  if (search) {
    queries.$or = [
      { first_name: { $regex: "(?i)" + search } },
      { last_name: { $regex: "(?i)" + search } },
      { email: { $regex: "(?i)" + search } },
    ];
  }

  await User.find(queries)
    .then((users) => {
      return res.status(200).json({ data: users });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.create = async (req, res) => {
  if (!req.body.first_name) {
    return res.status(422).json({ error: "First name is required." });
  }
  if (!req.body.last_name) {
    return res.status(422).json({ error: "Last name is required." });
  }

  if (!req.body.email) {
    return res.status(422).json({ error: "Email is required." });
  }

  if (!req.body.password) {
    return res.status(422).json({ error: "Password is required." });
  }

  if (!["admin", "seller", "user"].includes(req.body.role)) {
    return res.status(422).json({ error: "Invalid role." });
  }

  const isUniqueEmail = await User.findOne({
    email: req.body.email,
  }).select(["id"]);

  if (isUniqueEmail) {
    return res.status(422).json({ error: "Email already exist." });
  }

  const salt = await bcrypt.genSalt(10);
  const hasPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hasPassword,
    role: req.body.role,
    addresses: req.body.addresses,
  });

  await user
    .save()
    .then((user) => {
      const { password, updatedAt, ...other } = user._doc;

      return res.status(200).json({
        data: other,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong. User not created",
        error: err.message,
      });
    });
};

exports.findOne = async (req, res) => {
  const id = req.params.id;

  await User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      return res.status(200).json({ data: user });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. User not found.",
        error: err.message,
      });
    });
};

exports.update = async (req, res) => {
  const id = req.params.id;
  await User.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not updated." });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully.", data: user });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. User not updated.",
        error: err.message,
      });
    });
};

exports.delete = async (req, res) => {
  let id = req.params.id;
  await User.findByIdAndDelete(id)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not deleted." });
      }
      return res.status(200).json({ message: "User deleted successfully." });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. User not deleted.",
        error: err.message,
      });
    });
};
