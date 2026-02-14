const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendSuccess } = require('../utils/response');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.create({
      username,
      email,
      password,
    });

    return sendSuccess(res, {
      statusCode: 201,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      },
      message: 'Registration successful',
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400);
      err.message = 'User already exists';
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      return sendSuccess(res, {
        data: {
          _id: user._id,
          username: user.username,
          role: user.role,
          token: generateToken(user._id),
        },
        message: 'Login successful',
      });
    }

    res.status(401);
    throw new Error('Invalid credentials');
  } catch (err) {
    return next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    return sendSuccess(res, {
      data: user,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};

