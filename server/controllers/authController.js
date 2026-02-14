// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER A NEW USER
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully! 🎮' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// 2. LOGIN USER (We will build this fully in the next step)
// 2. LOGIN USER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 2. Compare the typed password with the hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // 3. If everything is correct, create a "Security Token" (JWT)
    // This is like a VIP pass for your Algorithm Arena site
    const token = jwt.sign(
      { userId: user._id,
        role: user.role
      }, 
      process.env.JWT_SECRET, // Use the secret from .env
      { expiresIn: '1h' }
    );

    res.json({ 
      token, 
      message: 'Login successful! 🚀',
      username: user.username,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};