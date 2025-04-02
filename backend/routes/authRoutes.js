const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Signup route (changed from register to match frontend)
router.post('/signup', register);

// Login route
router.post('/login', login);

module.exports = router;
