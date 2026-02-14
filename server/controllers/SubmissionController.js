const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');

const VALID_STATUSES = ['Pending', 'Accepted', 'Rejected'];

// @desc    Submit code for a challenge
// @route   POST /api/submissions
// @access  Private
exports.submitCode = async (req, res, next) => {
  try {
    const { challengeId, repositoryUrl, code, language } = req.body;

    if (!challengeId) {
      res.status(400);
      throw new Error('challengeId is required');
    }

    if (!repositoryUrl && !code) {
      res.status(400);
      throw new Error('Please provide code or a repository URL');
    }

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      res.status(404);
      throw new Error('Challenge not found');
    }

    const submission = await Submission.create({
      userId: req.user.id,
      challengeId,
      repositoryUrl: repositoryUrl || undefined,
      code: code || undefined,
      language: language || 'javascript',
    });

    res.status(201).json({
      success: true,
      data: submission,
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
      .populate('userId', 'username email role')
      .populate('challengeId', 'title difficulty points')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current user's submissions
// @route   GET /api/submissions/my-submissions
// @access  Private
exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id })
      .populate('challengeId', 'title difficulty points')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get leaderboard
// @route   GET /api/submissions/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: 'Accepted' } },
      {
        $lookup: {
          from: 'challenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge',
        },
      },
      { $unwind: '$challenge' },
      {
        $group: {
          _id: '$userId',
          solvedCount: { $sum: 1 },
          totalPoints: { $sum: '$challenge.points' },
        },
      },
      { $sort: { totalPoints: -1, solvedCount: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          username: '$user.username',
          solvedCount: 1,
          totalPoints: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single submission details
// @route   GET /api/submissions/:id
// @access  Private (Owner/Admin)
exports.getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('userId', 'username email role')
      .populate('challengeId', 'title difficulty points');

    if (!submission) {
      res.status(404);
      throw new Error('Submission not found');
    }

    const isOwner = submission.userId && submission.userId._id.toString() === req.user.id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to view this submission');
    }

    res.status(200).json({
      success: true,
      data: submission,
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
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('userId', 'username email role')
      .populate('challengeId', 'title difficulty points');

    if (!submission) {
      res.status(404);
      throw new Error('Submission not found');
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    next(err);
  }
};
