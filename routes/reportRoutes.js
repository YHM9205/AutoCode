const express = require('express');
const router = express.Router();
const { reports } = require('../controllers/reportController');

router.get('/', reports);

module.exports = router;
