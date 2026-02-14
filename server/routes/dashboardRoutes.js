const express = require('express');
const { protect } = require('../middleware/auth');
const { getDashboardSummary } = require('../controllers/statsController');

const router = express.Router();

router.get('/summary', protect, getDashboardSummary);

module.exports = router;

