const router = require("express").Router();
const cart = require("../controllers/cart.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/:id", isAuthenticated, cart.getAll);
router.post("/", isAuthenticated, cart.addToCart);
router.put("/", isAuthenticated, cart.updateCart);
router.put("/checkout", isAuthenticated, cart.checkout);

module.exports = router;
