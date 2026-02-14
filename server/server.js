require('dotenv').config();
const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('DNS setup warning:', err.message);
}

const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'active',
    uptime: process.uptime(),
    message: 'Algorithm Arena API is running',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  if (statusCode === 500) {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      statusCode = 400;
    }
    if (err.code === 11000) {
      statusCode = 400;
    }
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
