const express = require('express');
const router = express.Router();

const {
  submitCode,
  getSubmissions,
  getMySubmissions,
  getLeaderboard,
  getSubmissionById,
  updateSubmissionStatus,
} = require('../controllers/SubmissionController');

const { protect, admin } = require('../middleware/auth');

// Path: /api/submissions
router.route('/')
  .get(protect, admin, getSubmissions)
  .post(protect, submitCode);

// Path: /api/submissions/my-submissions
router.get('/my-submissions', protect, getMySubmissions);

// Path: /api/submissions/leaderboard
router.get('/leaderboard', protect, getLeaderboard);

// Path: /api/submissions/:id
router.route('/:id')
  .get(protect, getSubmissionById)
  .put(protect, admin, updateSubmissionStatus);

module.exports = router;
