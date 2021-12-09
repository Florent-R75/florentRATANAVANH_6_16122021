const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');

router
  .route('/')
  .post(multer, sauceCtrl.createSauce)
  .get(sauceCtrl.getAllSauces);

router
  .route('/:id')
  .get(sauceCtrl.getOneSauce)
  .put(sauceCtrl.updateSauce)
  .delete(sauceCtrl.deleteSauce);

router.route('/:id/like').post(sauceCtrl.likeSauce);

module.exports = router;
