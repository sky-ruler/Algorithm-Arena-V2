const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');

// @desc    Submit code for a challenge
// @route   POST /api/submissions
// @access  Private
exports.submitCode = async (req, res, next) => {
  try {
    const { challengeId, code, language } = req.body;

    // 1. Check if challenge exists
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404);
      throw new Error('Challenge not found');
    }

    // 2. Create the submission
    const submission = await Submission.create({
      user: req.user.id, // Attached by 'protect' middleware
      challenge: challengeId,
      code,
      language: language || 'javascript',
      status: 'pending' // Default status
    });

    res.status(201).json({
      success: true,
      data: submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all submissions (Admin / Teacher View)
// @route   GET /api/submissions
// @access  Private/Admin
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find()
      .populate('user', 'username email')    // Get student details
      .populate('challenge', 'title points') // Get challenge details
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single submission details
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('user', 'username')
      .populate('challenge', 'title');

    if (!submission) {
      res.status(404);
      throw new Error('Submission not found');
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update submission status (Grading)
// @route   PUT /api/submissions/:id
// @access  Private/Admin
exports.updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // e.g., 'accepted', 'rejected'

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!submission) {
      res.status(404);
      throw new Error('Submission not found');
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (err) {
    next(err);
  }
};