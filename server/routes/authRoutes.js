const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // We will refine this file next!

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // 🔒 The "Persistence" Route

module.exports = router;