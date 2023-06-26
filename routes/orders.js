const router = require("express").Router();
const Order = require("../models/Order");

router.get("/:id", async (req, res) => {
  try {
    const queries = { user: req.params.id };
    const orders = await Order.find(queries);

    if (!orders) {
      return res.status(200).json({ error: "No orders." });
    }

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id/track", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).select(["status", "_id"]);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// update order status
router.put("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }
    ).select(["_id", "status"]);

    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
