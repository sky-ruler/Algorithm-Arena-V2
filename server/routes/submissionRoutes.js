const express = require('express');
const router = express.Router();

// --- 1. Import Controller Functions ---
// We will refine/create this controller file in the next step
const { 
  submitCode, 
  getSubmissions, 
  getSubmissionById, 
  updateSubmissionStatus 
} = require('../controllers/submissionController');

// --- 2. Import Middleware ---
// Using the refined 'protect' and 'admin' guards
const { protect, admin } = require('../middleware/auth');

// --- 3. Route Definitions ---

// Path: /api/submissions
router.route('/')
  .get(protect, admin, getSubmissions) // Admin Only: View all student work
  .post(protect, submitCode);          // Logged-in Users: Submit their answer

// Path: /api/submissions/:id
router.route('/:id')
  .get(protect, getSubmissionById)              // User/Admin: View specific details
  .put(protect, admin, updateSubmissionStatus); // Admin Only: Grade/Review code

module.exports = router;