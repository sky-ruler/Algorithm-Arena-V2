const Submission = require('../src/features/submissions/Submission.model');

/**
 * Computes the rank of a single user using a DB-level pipeline.
 * Uses $setWindowFields + $match so only one document is returned — no JS-level
 * array iteration over the full leaderboard.
 *
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<number|null>} 1-based rank, or null if no accepted submissions.
 */
const getUserRank = async (userId) => {
  const result = await Submission.aggregate([
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
        totalPoints: { $sum: '$challenge.points' },
        solvedCount: { $sum: 1 },
      },
    },
    { $sort: { totalPoints: -1, solvedCount: -1 } },
    {
      $setWindowFields: {
        sortBy: { totalPoints: -1 },
        output: { rank: { $denseRank: {} } },
      },
    },
    { $match: { _id: userId } },
  ]);

  return result.length ? result[0].rank : null;
};

module.exports = { getUserRank };
