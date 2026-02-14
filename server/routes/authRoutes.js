// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define the "Register" path
// This maps to http://localhost:5000/api/auth/register
router.post('/register', authController.register);

// Define the "Login" path
router.post('/login', authController.login);

module.exports = router;