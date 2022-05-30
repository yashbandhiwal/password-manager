const express = require('express');
const {
  savePassword,
  generatePassword
} = require('../controllers/manager');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/savePassword',protect, savePassword);
router.post('/generatePassword', protect, generatePassword)

module.exports = router;
