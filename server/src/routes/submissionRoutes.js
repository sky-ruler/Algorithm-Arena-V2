const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const { verifyToken, isAdmin } = require('../middleware/auth'); // Import Guards

// GET Leaderboard (Public)
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      { $match: { status: 'Accepted' } },
      { $group: { _id: { userId: "$userId", challengeId: "$challengeId" } } },
      { $lookup: { from: "challenges", localField: "_id.challengeId", foreignField: "_id", as: "challengeInfo" } },
      { $unwind: "$challengeInfo" },
      { $group: { _id: "$_id.userId", totalPoints: { $sum: "$challengeInfo.points" }, solvedCount: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "userInfo" } },
      { $unwind: "$userInfo" },
      { $project: { username: "$userInfo.username", totalPoints: 1, solvedCount: 1 } },
      { $sort: { totalPoints: -1 } }
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// GET My Submissions (User Protected)
router.get('/my-submissions', verifyToken, async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.userId })
      .populate('challengeId', 'title difficulty points')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET ALL Submissions (🛡️ LOCKED: ADMIN ONLY)
router.get('/', verifyToken, isAdmin, async (req, res) => { 
  try {
    const submissions = await Submission.find()
      .populate('userId', 'username email')
      .populate('challengeId', 'title')
      .sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST Submit (User Protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { challengeId, repositoryUrl, code } = req.body;
    if (!repositoryUrl && !code) return res.status(400).json({ message: 'Provide Link or Code.' });
    
    const newSubmission = new Submission({
      challengeId,
      userId: req.userId,
      repositoryUrl,
      code
    });
    await newSubmission.save();
    res.status(201).json({ message: 'Solution Submitted Successfully! 🚀' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// PUT Grade (🛡️ LOCKED: ADMIN ONLY)
router.put('/:id', verifyToken, isAdmin, async (req, res) => { 
  try {
    const { status } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: 'Update Failed' });
  }
});

module.exports = router;