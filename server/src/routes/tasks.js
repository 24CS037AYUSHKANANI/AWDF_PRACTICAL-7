const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const validateTask = require("../middleware/taskValidation");
const controller = require("../controllers/tasks");

router.use(authenticate);

router.get("/", controller.all);
router.post("/", validateTask, controller.add);
router.put("/:id", validateTask, controller.change);
router.delete("/:id", controller.remove);

module.exports = router;
