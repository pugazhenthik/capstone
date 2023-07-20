const router = require("express").Router();
const productReview = require("../controllers/productReview.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.post("/", isAuthenticated, productReview.create);
router.get("/", isAuthenticated, productReview.findAll);
router.get("/:id", isAuthenticated, productReview.findOne);
router.put("/:id", isAuthenticated, productReview.update);
router.delete("/:id", isAuthenticated, productReview.delete);

module.exports = router;
