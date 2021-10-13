const express = require("express");
const router = express.Router();
const sauceCtrl = require("../controllers/sauceControllers");

router.post("/", sauceCtrl.createSauces);
router.get("/", sauceCtrl.listSauces);
module.exports = router;
