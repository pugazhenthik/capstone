const Order = require("../models/Order");

exports.getAll = async (req, res) => {
  const queries = { user: req.params.id };
  await Order.find(queries)
    .then((orders) => {
      if (!orders) {
        return res.status(200).json({ error: "No orders." });
      }
      res.status(200).json({ data: orders });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.trackOrder = async (req, res) => {
  await Order.findById(req.params.id)
    .select(["status", "_id"])
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Order not found!." });
      }
      return res.status(200).json({ data: order });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

exports.updateOrderStatus = async (req, res) => {
  await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  )
    .select(["_id", "status"])
    .then((order) => {
      res.status(200).json({ data: order });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};
