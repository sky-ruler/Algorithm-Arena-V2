// client/src/constants/difficulty.js
// Single source of truth for difficulty colors. Values mirror the
// --diff-easy/--diff-medium/--diff-hard CSS variables in index.css.

export const DIFFICULTY_RGB = {
  Easy: "34, 197, 94",
  Medium: "234, 179, 8",
  Hard: "239, 68, 68",
};

export const DIFFICULTY_ORDER = { Easy: 1, Medium: 2, Hard: 3 };

export const getDifficultyRGB = (difficulty) =>
  DIFFICULTY_RGB[difficulty] || "99, 102, 241";
