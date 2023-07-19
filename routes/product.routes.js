const router = require("express").Router();

const product = require("../controllers/product.controller");
const { isAdminOrSeller } = require("../middlewares/auth.middleware");

router.get("/", product.findAll);
router.post("/", isAdminOrSeller, product.create);
router.get("/:id", product.findOne);
router.put("/:id", isAdminOrSeller, product.update);
router.delete("/:id", isAdminOrSeller, product.delete);

module.exports = router;
