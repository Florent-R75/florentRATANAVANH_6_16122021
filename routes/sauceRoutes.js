const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauceControllers');
const multer = require('../middleware/multerConfig');
const auth = require('./../middleware/auth');
const perm=require('./../middleware/permission');

router
  .route('/')
  .post(auth, multer, sauceCtrl.createSauce)
  .get(auth, sauceCtrl.getAllSauces);

router
  .route('/:id')
  .get(auth, sauceCtrl.getOneSauce)
  .put(auth, perm, sauceCtrl.updateSauce)
  .delete(auth, perm, sauceCtrl.deleteSauce);

router.route('/:id/like').post(sauceCtrl.likeSauce);

module.exports = router;
