const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');

router.post('/', multer, sauceCtrl.createSauces).get('/', sauceCtrl.listSauces);
// router.get("/", sauceCtrl.listSauces);
router.get('/:id', sauceCtrl.getSauces);
module.exports = router;
