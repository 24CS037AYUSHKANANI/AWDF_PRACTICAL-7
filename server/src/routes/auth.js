const router = require("express").Router();
const { register, login, profile } = require("../controllers/auth");
const authenticate = require("../middleware/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, profile);

module.exports = router;
