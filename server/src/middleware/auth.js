const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Guard: Are you logged in?
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// 2. Guard: Are you an Admin?
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access Denied: Admins Only 🛡️' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server Error checking role' });
  }
};

module.exports = { verifyToken, isAdmin };