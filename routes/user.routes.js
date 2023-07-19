const router = require("express").Router();

const user = require("../controllers/user.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

router.get("/", isAdmin, user.findAll);
router.post("/", user.create);
router.get("/:id", isAdmin, user.findOne);
router.put("/:id", isAdmin, user.update);
router.delete("/:id", isAdmin, user.delete);

module.exports = router;
