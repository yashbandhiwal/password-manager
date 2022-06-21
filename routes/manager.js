const express = require('express');
const {
  savePassword,
  generatePassword,
  getall,
  getOne,
  viewPassword,//pendng
  updateManager
} = require('../controllers/manager');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/savePassword',protect, savePassword);
router.post('/generatePassword', protect, generatePassword);
router.post('/getall',getall);
router.route("/getone").post(getOne);
router.route("/viewpassword").post(viewPassword);
router.route("/updateManager").post(protect,updateManager)

module.exports = router;
