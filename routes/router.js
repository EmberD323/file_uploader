
const { Router } = require("express");
const router = Router();
const controller = require("../controllers/controller");

router.get("/", controller.homeGet);

module.exports = router;

