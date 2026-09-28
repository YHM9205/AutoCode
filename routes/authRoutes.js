const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/', (req, res) => {
    res.redirect('/')
})

router.get('/login', authController.ownerLogin)
router.post('/login', authController.loginUser)

router.get('/signup', authController.ownerSignup)
router.post('/signup', authController.signupUser)

router.get('/logout', authController.logoutUser)

module.exports = router;