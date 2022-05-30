const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/getMe', protect, getMe);
router.get('/logout', logout);
router.post('/updateDetails', protect, updateDetails)
router.post('/updatePassword', protect, updatePassword);
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword/:resettoken', resetPassword)

module.exports = router;
