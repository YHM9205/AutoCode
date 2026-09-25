const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/signup', authController.ownerSignup)
router.post('/signup', authController.signupUser)

router.get('/login', authController,ownerLogin)
router.post('/login', authController,loginUser)

module.exports = router;