const express = require('express');
const router = express.Router();

const {
  submitCode,
  getSubmissions,
  getMySubmissions,
  getLeaderboard,
  getSubmissionById,
  updateSubmissionStatus,
  getSubmissionsByUsername,
} = require('./submission.controller');

const { protect, admin, chiefOrAdmin } = require('../../../middleware/auth');
const { validate } = require('../../../middleware/validate');
const {
  submissionIdParamsSchema,
  submissionCreateSchema,
  submissionUpdateSchema,
  submissionQuerySchema,
  leaderboardQuerySchema,
  mySubmissionQuerySchema,
  userSubmissionQuerySchema,
} = require('../../../validators/submissionSchemas');

router
  .route('/')
  .get(protect, chiefOrAdmin, validate(submissionQuerySchema), getSubmissions)
  .post(protect, validate(submissionCreateSchema), submitCode);

router.get('/my-submissions', protect, validate(mySubmissionQuerySchema), getMySubmissions);
router.get('/my', protect, validate(mySubmissionQuerySchema), getMySubmissions);
router.get('/leaderboard', protect, validate(leaderboardQuerySchema), getLeaderboard);
router.get('/user/:username', protect, validate(userSubmissionQuerySchema), getSubmissionsByUsername);

router
  .route('/:id')
  .get(protect, validate(submissionIdParamsSchema), getSubmissionById)
  .put(protect, chiefOrAdmin, validate(submissionIdParamsSchema), validate(submissionUpdateSchema), updateSubmissionStatus);

module.exports = router;

