const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const isUniqueEmail = await User.findOne({
      email: req.body.email,
    });

    if (isUniqueEmail) {
      return res.status(400).json({ error: "Email already exist!" });
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
      return res.status(400).json({ error: "User not found!" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password!" });
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
