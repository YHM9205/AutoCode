const express = require('express')
const router = express.Router()
const obdController = require('../controllers/obdController')


router.get('/', obdController.getAllCodes)

module.exports = router