require('dotenv').config();
const dns = require('dns');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');           // 🛡️ Security Headers
const morgan = require('morgan');           // 📜 Request Logging
const rateLimit = require('express-rate-limit'); // ⏱️ Rate Limiting

// 🔧 FIX: Force Node.js to use Google DNS to bypass ISP blocks
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('⚠️ DNS Setup Warning:', err.message);
}

// Import Routes
const authRoutes = require('./routes/authRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();

// --- 1. Global Middleware ---
app.use(helmet()); // Adds security headers (XSS protection, etc.)
app.use(morgan('dev')); // Logs requests to the console
app.use(express.json()); // Parses JSON bodies
app.use(cors()); // Allows Cross-Origin requests

// --- 2. Rate Limiting (Security) ---
// Limit repeated requests to public APIs to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// --- 3. Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (via Google DNS)`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1); // Stop the app if DB fails
  }
};
connectDB();

// --- 4. Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);

// --- 5. Health Check ---
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'active', 
    uptime: process.uptime(),
    message: 'Algorithm Arena API is Running 🚀' 
  });
});

// --- 6. Global Error Handler ---
// Catches any errors thrown in routes so the server doesn't crash
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// --- 7. Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});