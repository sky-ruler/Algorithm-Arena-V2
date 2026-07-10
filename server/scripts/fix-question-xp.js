// One-time migration: recompute `points` for existing Challenge docs and
// QuestionSet-embedded questions from their `difficulty`, since points used
// to be a free-form field that defaulted to 100 regardless of difficulty.
const mongoose = require('mongoose');
require('dotenv').config();

const { env } = require('../config/env');
const { getPointsForDifficulty } = require('../utils/xp');
const Challenge = require('../src/features/challenges/Challenge.model');
const QuestionSet = require('../src/features/challenges/QuestionSet.model');

async function fixChallenges(shouldApply) {
  const challenges = await Challenge.find({}).select('_id difficulty points');
  let updated = 0;

  const ops = [];
  for (const c of challenges) {
    const correct = getPointsForDifficulty(c.difficulty);
    if (c.points !== correct) {
      updated += 1;
      if (shouldApply) {
        ops.push({ updateOne: { filter: { _id: c._id }, update: { $set: { points: correct } } } });
      }
    }
  }

  if (shouldApply && ops.length > 0) {
    await Challenge.bulkWrite(ops, { ordered: false });
  }

  return { total: challenges.length, updated };
}

async function fixQuestionSets(shouldApply) {
  const sets = await QuestionSet.find({}).select('_id questions');
  let setsChanged = 0;
  let questionsUpdated = 0;

  for (const set of sets) {
    let changed = false;
    for (const q of set.questions) {
      const correct = getPointsForDifficulty(q.difficulty);
      if (q.points !== correct) {
        q.points = correct;
        changed = true;
        questionsUpdated += 1;
      }
    }
    if (changed) {
      setsChanged += 1;
      if (shouldApply) {
        await set.save();
      }
    }
  }

  return { total: sets.length, setsChanged, questionsUpdated };
}

async function main() {
  const shouldApply = process.argv.includes('--apply');
  const uriFlag = process.argv.find((arg) => arg.startsWith('--uri='));
  const uri = (uriFlag && uriFlag.slice('--uri='.length)) || process.env.MONGO_URI || env.MONGO_URI;

  if (!shouldApply) {
    console.log('Preview only. Re-run with --apply to write changes to the database.');
  }

  if (!uri) {
    throw new Error('Missing MongoDB URI. Pass --uri=... or set MONGO_URI.');
  }

  await mongoose.connect(uri);
  console.log(`Connected to ${mongoose.connection.host || 'database'}`);

  const challengeSummary = await fixChallenges(shouldApply);
  const questionSetSummary = await fixQuestionSets(shouldApply);

  console.log(JSON.stringify({ challengeSummary, questionSetSummary }, null, 2));

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('XP fix migration failed:', error);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore disconnect errors
  }
  process.exit(1);
});
