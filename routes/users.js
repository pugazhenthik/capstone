const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const queries = {};
    const search = req.query.search;

    if (search) {
      queries.$or = [
        { first_name: { $regex: "(?i)" + search } },
        { last_name: { $regex: "(?i)" + search } },
        { email: { $regex: "(?i)" + search } },
      ];
    }

    const users = await User.find(queries);

    if (!users) {
      return res.status(200).json({ message: "No users." });
    }

    res.status(200).json({ data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error.");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res.status(200).json({
      message: "User updated successfully.",
      data: user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;

    if (!user) {
      res.status(404).json({ error: "User not found!." });
    }

    res.status(200).json({ data: other });
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "User not found!." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
