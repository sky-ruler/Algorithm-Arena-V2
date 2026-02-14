const Challenge = require('../models/Challenge');

// @desc    Get all challenges
// @route   GET /api/challenges
// @access  Public
exports.getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: challenges.length,
      data: challenges,
    });
  } catch (err) {
    next(err); // Passes error to the global handler in server.js
  }
};

// @desc    Get single challenge
// @route   GET /api/challenges/:id
// @access  Public
exports.getChallengeById = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      res.status(404);
      throw new Error('Challenge not found');
    }

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new challenge
// @route   POST /api/challenges
// @access  Private/Admin
exports.createChallenge = async (req, res, next) => {
  try {
    // Basic validation
    const { title, description, points } = req.body;
    if (!title || !description || !points) {
      res.status(400);
      throw new Error('Please include a title, description, and points');
    }

    const challenge = await Challenge.create(req.body);

    res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update challenge
// @route   PUT /api/challenges/:id
// @access  Private/Admin
exports.updateChallenge = async (req, res, next) => {
  try {
    let challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      res.status(404);
      throw new Error('Challenge not found');
    }

    challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: challenge,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private/Admin
exports.deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      res.status(404);
      throw new Error('Challenge not found');
    }

    await challenge.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Challenge removed successfully',
    });
  } catch (err) {
    next(err);
  }
};