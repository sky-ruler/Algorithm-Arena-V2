const DIFFICULTY_POINTS = {
  Easy: 100,
  Medium: 200,
  Hard: 350,
};

const getPointsForDifficulty = (difficulty) => DIFFICULTY_POINTS[difficulty] ?? DIFFICULTY_POINTS.Easy;

module.exports = { DIFFICULTY_POINTS, getPointsForDifficulty };
