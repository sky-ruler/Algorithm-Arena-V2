const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');
const { sendSuccess } = require('../utils/response');

const getDashboardSummary = async (req, res, next) => {
  try {
    const [totalChallenges, pending, solvedDistinct] = await Promise.all([
      Challenge.countDocuments(),
      Submission.countDocuments({ userId: req.user.id, status: 'Pending' }),
      Submission.distinct('challengeId', { userId: req.user.id, status: 'Accepted' }),
    ]);

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
    ]);

    const rank = leaderboard.findIndex((entry) => entry._id.toString() === req.user.id.toString());
    const recentActivity = await Submission.find({ userId: req.user.id })
      .populate('challengeId', 'title difficulty points')
      .sort({ submittedAt: -1 })
      .limit(5);

    return sendSuccess(res, {
      data: {
        totalChallenges,
        solved: solvedDistinct.length,
        pending,
        rank: rank === -1 ? null : rank + 1,
        recentActivity,
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getProfileStats = async (req, res, next) => {
  try {
    const [stats] = await Submission.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: 'challenges',
          localField: 'challengeId',
          foreignField: '_id',
          as: 'challenge',
        },
      },
      {
        $addFields: {
          challenge: { $arrayElemAt: ['$challenge', 0] },
        },
      },
      {
        $group: {
          _id: '$userId',
          totalSubmissions: { $sum: 1 },
          acceptedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] },
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          totalPoints: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Accepted'] }, '$challenge.points', 0],
            },
          },
        },
      },
    ]);

    const recentSubmissions = await Submission.find({ userId: req.user.id })
      .populate('challengeId', 'title difficulty points')
      .sort({ submittedAt: -1 })
      .limit(10);

    return sendSuccess(res, {
      data: {
        totalSubmissions: stats?.totalSubmissions || 0,
        acceptedCount: stats?.acceptedCount || 0,
        rejectedCount: stats?.rejectedCount || 0,
        pendingCount: stats?.pendingCount || 0,
        totalPoints: stats?.totalPoints || 0,
        recentSubmissions,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getDashboardSummary,
  getProfileStats,
};

