const SellerReview = require("../models/SellerReview");
const User = require("../models/User");

exports.findAll = async (req, res) => {
  const queries = {};
  if (req.params.id) {
    queries.seller = req.params.id;
  }

  await SellerReview.find(queries)
    .then((reviews) => {
      return res.status(200).json({ data: reviews });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.create = async (req, res) => {
  const sellerId = req.body.seller;
  const userId = req.body.user;

  if (sellerId === userId) {
    return res.status(422).json({ error: "Self review is restricted." });
  }

  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required." });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required." });
  }

  await User.findOne({ _id: sellerId, role: "seller" })
    .select(["_id"])
    .then((seller) => {
      if (!seller) {
        return res.status(422).json({ error: "Invalid seller." });
      }
    });

  await User.findOne({ _id: userId, role: "user" })
    .select(["_id"])
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid user." });
      }
    });

  const review = new SellerReview({
    body: req.body.body,
    rating: req.body.rating,
    seller: sellerId,
    user: userId,
  });

  await review
    .save()
    .then((review) => {
      return res
        .status(200)
        .json({ message: "Review added successfully!", data: review });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.findOne = async (req, res) => {
  let id = req.params.id;

  await SellerReview.findById(id)
    .then((reviews) => {
      res.status(200).json({ data: reviews });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.update = async (req, res) => {
  const sellerId = req.body.seller;
  const userId = req.body.user;
  if (sellerId === userId) {
    return res.status(422).json({ error: "Self review is restricted." });
  }

  if (!req.body.body) {
    return res.status(422).json({ error: "Review is required." });
  }

  if (!req.body.rating) {
    return res.status(422).json({ error: "Rating is required." });
  }

  await User.findOne({ _id: sellerId, role: "seller" })
    .select(["_id"])
    .then((seller) => {
      if (!seller) {
        return res.status(422).json({ error: "Invalid seller." });
      }
    });

  await User.findOne({ _id: userId, role: "user" })
    .select(["_id"])
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid user." });
      }
    });

  await SellerReview.findByIdAndUpdate(
    req.params.id,
    {
      body: req.body.body,
      rating: req.body.rating,
      seller: sellerId,
      user: userId,
    },
    { new: true }
  )
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "Review not found!." });
      }

      return res
        .status(200)
        .json({ message: "Review updated successfully.", data: review });
    })

    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.delete = async (req, res) => {
  await SellerReview.findByIdAndDelete(req.params.id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "Review not found!." });
      }
      return res.status(200).json({ message: "Review deleted successfully." });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};
