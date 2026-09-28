const express = require('express')
const router = express.Router()
const obdController = require('../controllers/obdController')

// Mounted at /obd, public (no login needed)

// Index: list all OBD codes, filter with ?q=P03
router.get('/', obdController.getAllCodes)

module.exports = router
