const express = require('express');
const router = express.Router();

// --- 1. Import Controller Functions ---
// This file focuses ONLY on Challenges
const { 
  getChallenges, 
  getChallengeById, 
  createChallenge, 
  updateChallenge, 
  deleteChallenge 
} = require('../controllers/challengeController');

// --- 2. Import Middleware ---
// Using the refined names we created in middleware/auth.js
const { protect, admin } = require('../middleware/auth');

// --- 3. Route Definitions ---

// Route: /api/challenges
router.route('/')
  .get(getChallenges)                   // Public: For everyone to see the list
  .post(protect, admin, createChallenge); // Admin Only: Create new challenges

// Route: /api/challenges/:id
router.route('/:id')
  .get(getChallengeById)                // Public: View details of a specific problem
  .put(protect, admin, updateChallenge) // Admin Only: Update existing problems
  .delete(protect, admin, deleteChallenge); // Admin Only: Remove problems

module.exports = router;