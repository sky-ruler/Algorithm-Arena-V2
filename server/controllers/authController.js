const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Utility: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Create user (Model pre-save hook handles hashing)
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    // Pass duplicate key errors (E11000) to the global handler
    if (err.code === 11000) {
      res.status(400);
      err.message = 'User already exists';
    }
    next(err);
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    // Check for user
    // We verify the password using the method in the User model
    // We explicitly select '+password' because it's hidden by default
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};