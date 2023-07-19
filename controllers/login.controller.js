const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  await User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "Account does not exist with this email address." });
      }

      const validPassword = async () =>
        await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(422).json({ error: "Your password is incorrect." });
      }

      const { password, updatedAt, ...other } = user._doc;

      other.token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY
      );

      return res.status(200).json({ data: other });
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Something went wrong. Login failed.",
        error: err.message,
      });
    });
};
