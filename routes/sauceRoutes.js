const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');

router
  .post('/', multer, sauceCtrl.createSauce)
  .get('/', sauceCtrl.getAllSauces);

router
  .get('/:id', sauceCtrl.getOneSauce)
  .put('/:id', sauceCtrl.updateSauce)
  .delete('/:id', sauceCtrl.deleteSauce);


router.post('/:id/like', sauceCtrl.likeSauce);

module.exports = router;
