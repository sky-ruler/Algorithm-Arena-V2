const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { verifyToken, isAdmin } = require('../middleware/auth');

// 1. GET ALL (Public) - For Dashboard
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. GET ONE (Public) - For Challenge Details
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// 3. CREATE (🛡️ ADMIN ONLY)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  const { title, description, difficulty, points } = req.body;
  
  if (!title || !description || !points) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  const newChallenge = new Challenge({ 
    title, 
    description, 
    difficulty, 
    points 
  });

  try {
    const savedChallenge = await newChallenge.save();
    res.status(201).json(savedChallenge);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create challenge' });
  }
});

// 4. UPDATE (🛡️ ADMIN ONLY) - Fix typos
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated version
    );
    res.json(updatedChallenge);
  } catch (err) {
    res.status(400).json({ message: 'Update failed' });
  }
});

// 5. DELETE (🛡️ ADMIN ONLY) - Remove broken challenges
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.json({ message: 'Challenge deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;