const express = require('express');
const {
  savePassword
} = require('../controllers/manager');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/savePassword',protect, savePassword);

module.exports = router;
