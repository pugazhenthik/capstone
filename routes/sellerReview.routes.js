const router = require("express").Router();
const sellerReview = require("../controllers/sellerReview.controller");
const { isAuthenticated } = require("../middlewares/auth.middleware");

router.get("/", isAuthenticated, sellerReview.findAll);
router.post("/", isAuthenticated, sellerReview.create);
router.get("/:id", isAuthenticated, sellerReview.findOne);
router.put("/:id", isAuthenticated, sellerReview.update);
router.delete("/:id", isAuthenticated, sellerReview.delete);

module.exports = router;
