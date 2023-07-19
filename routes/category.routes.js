const router = require("express").Router();

const category = require("../controllers/category.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

router.get("/", isAdmin, category.findAll);
router.post("/", isAdmin, category.create);
router.get("/:id", isAdmin, category.findOne);
router.put("/:id", isAdmin, category.update);
router.delete("/:id", isAdmin, category.delete);

module.exports = router;
