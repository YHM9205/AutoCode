const express = require('express');
const router = express.Router();
const { reports } = require('../controllers/reportController');

// Mounted at /reports and requires a signed-in user

// Most common codes overall and per car make
router.get('/', reports);

module.exports = router;
