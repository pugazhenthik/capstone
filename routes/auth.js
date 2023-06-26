const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
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

    await user.save();
    const { password, updatedAt, ...other } = user._doc;

    res.status(200).json({
      data: other,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error, user not registered" });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res
        .status(422)
        .json({ error: "Account does not exist with this email address." });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(422).json({ error: "Your password is incorrect." });
    }

    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json({ data: other });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal server error, user not logged in" });
  }
});

module.exports = router;
