const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// All routes here are mounted at /auth

// /auth on its own has no page, send the user home
router.get('/', (req, res) => {
    res.redirect('/')
})

// Login: show the form, then check credentials and start a session
router.get('/login', authController.ownerLogin)
router.post('/login', authController.loginUser)

// Sign up: show the form, then create the user and owner profile
router.get('/signup', authController.ownerSignup)
router.post('/signup', authController.signupUser)

// Logout: end the session
router.get('/logout', authController.logoutUser)

module.exports = router;
