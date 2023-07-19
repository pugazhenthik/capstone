const router = require("express").Router();
const order = require("../controllers/order.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/:id", isAuthenticated, order.getAll);
router.get("/:id/track", isAuthenticated, order.trackOrder);
router.put("/:id", isAuthenticated, order.updateOrderStatus);

module.exports = router;
