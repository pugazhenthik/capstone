const Order = require("../models/Order");

exports.getAll = async (req, res) => {
  // TODO replace user id with authentication
  const queries = { status: "cart", user: req.params.id };
  await Order.find(queries)
    .then((cartItems) => {
      if (!cartItems.length) {
        return res.status(200).json({ message: "Cart is empty.", data: [] });
      }

      res.status(200).json({ data: cartItems });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong", error: err.message });
    });
};

exports.addToCart = async (req, res) => {
  await Order.findOne({
    status: "cart",
    user: req.body.user,
  })
    .select(["id", "items"])
    .then(async (cartItems) => {
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
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Something went wrong.", error: err.message });
    });
};

exports.updateCart = async (req, res) => {
  await Order.find({ user: req.body.user })
    .select(["id"])
    .then(async (orderId) => {
      if (!orderId) {
        return res.status(404).json({ error: "Cart is empty." });
      }

      let items = req.body.items;
      // calculate tax and total
      const tax = 0.18;
      const subtotal = items
        .map((item) => item.price * item.quantity)
        .reduce((prev, next) => prev + next);
      const taxAmout = subtotal * tax;
      const total = subtotal + taxAmout;

      await Order.findByIdAndUpdate(
        orderId,
        {
          user: req.body.user,
          tax: taxAmout,
          subtotal: subtotal,
          total: total,
          items: items,
        },
        { new: true }
      )
        .then((order) => {
          res.status(200).json({ data: order });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong. Cart not update.",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};

exports.checkout = async (req, res) => {
  await Order.find({ user: req.body.user })
    .select(["id"])
    .then(async (orderId) => {
      if (!orderId) {
        return res.status(404).json({ error: "Cart is empty." });
      }

      await Order.findByIdAndUpdate(
        orderId,
        {
          status: "checkout",
        },
        { new: true }
      )
        .then((order) => {
          return res.status(200).json({ data: order });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong. Checkout not completed",
            error: err.message,
          });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Something went wrong.", error: err.message });
    });
};
