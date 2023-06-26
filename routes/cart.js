const router = require("express").Router();
const Order = require("../models/Order");
const User = require("../models/User");

router.get("/:id", async (req, res) => {
  try {
    // TODO replace user id with authentication
    const queries = { status: "cart", user: req.params.id };
    const cartItems = await Order.find(queries);

    if (!cartItems.length) {
      return res.status(200).json({ message: "Cart is empty.", data: [] });
    }

    res.status(200).json({ data: cartItems });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

// add to cart
router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.body.user).select(["_id"]);
    if (!user) {
      return res.status(422).json({ error: "User not found!." });
    }

    const cartItems = await Order.findOne({
      status: "cart",
      user: req.body.user,
    }).select(["id", "items"]);

    let items = [];
    if (cartItems) {
      items = [...cartItems.items];
    }
    items.push(req.body.item);

    // calculate tax and total
    const tax = 0.18;
    const subtotal = items
      .map((item) => item.price * item.quantity)
      .reduce((prev, next) => prev + next);
    const taxAmout = subtotal * tax;
    const total = subtotal + taxAmout;

    const data = {
      user: req.body.user,
      tax: taxAmout,
      subtotal: subtotal,
      total: total,
      items: items,
    };

    let order;
    if (cartItems) {
      order = await Order.findByIdAndUpdate(cartItems.id, data, {
        new: true,
      });
    } else {
      order = new Order(data);
      await order.save();
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

// update cart
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.body.user).select(["id"]);
    if (!user) {
      return res.status(404).json({ error: "User not found!." });
    }

    let items = req.body.items;
    // calculate tax and total
    const tax = 0.18;
    const subtotal = items
      .map((item) => item.price * item.quantity)
      .reduce((prev, next) => prev + next);
    const taxAmout = subtotal * tax;
    const total = subtotal + taxAmout;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        user: req.body.user,
        tax: taxAmout,
        subtotal: subtotal,
        total: total,
        items: items,
      },
      { new: true }
    );

    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

router.put("/checkout/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: "checkout",
      },
      { new: true }
    );

    res.status(200).json({ data: order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
