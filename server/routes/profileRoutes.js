const express = require('express');
const { protect } = require('../middleware/auth');
const { getProfileStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/stats', protect, getProfileStats);

module.exports = router;

