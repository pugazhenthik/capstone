const router = require("express").Router();
const SellerReview = require("../models/SellerReview");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const sellerId = req.body.seller;
  const userId = req.body.user;

  if (sellerId === userId) {
    return res.status(422).json({ error: "Self review is restricted" });
  }

  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required" });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required" });
  }

  try {
    const seller = await User.findOne({ _id: sellerId, role: "seller" }).select(
      ["_id"]
    );
    if (!seller) {
      return res.status(422).json({ error: "Invalid seller!" });
    }

    const user = await User.findOne({ _id: userId, role: "user" }).select([
      "_id",
    ]);
    if (!user) {
      return res.status(422).json({ error: "Invalid user!" });
    }

    const review = new SellerReview({
      body: req.body.body,
      rating: req.body.rating,
      seller: sellerId,
      user: userId,
    });

    await review.save();

    res
      .status(200)
      .json({ message: "Review added successfully!", data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id?", async (req, res) => {
  try {
    const queries = {};
    if (req.params.id) {
      queries.seller = req.params.id;
    }
    const reviews = await SellerReview.find(queries);

    if (!reviews.length) {
      res.status(200).json({ message: "No reviews!", data: [] });
    }

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:reviewId", async (req, res) => {
  const sellerId = req.body.seller;
  const userId = req.body.user;
  if (sellerId === userId) {
    return res.status(422).json({ error: "Self review is restricted" });
  }

  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required" });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required" });
  }

  try {
    const seller = await User.findOne({ _id: sellerId, role: "seller" }).select(
      ["_id"]
    );
    if (!seller) {
      return res.status(422).json({ error: "Invalid seller!" });
    }

    const user = await User.findOne({ _id: userId, role: "user" }).select([
      "_id",
    ]);
    if (!user) {
      return res.status(422).json({ error: "Invalid user!" });
    }

    const review = await SellerReview.findByIdAndUpdate(
      req.params.reviewId,
      {
        body: req.body.body,
        rating: req.body.rating,
        seller: sellerId,
        user: userId,
      },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: "Review not found!" });
    }

    res
      .status(200)
      .json({ message: "Review updated successfully!", data: review });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    const review = await SellerReview.findByIdAndDelete(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
