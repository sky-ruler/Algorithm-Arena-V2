require('dotenv').config();
const mongoose = require('mongoose');
const { env } = require('./config/env');
const Challenge = require('./src/features/challenges/Challenge.model');

async function check() {
  if (process.env.NODE_ENV === 'production') {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
  await mongoose.connect(env.MONGO_URI);
  const challenges = await Challenge.find({ title: /Palindrome/i });
  console.log('Found palindromes:');
  challenges.forEach(ch => console.log(ch._id, ch.title, ch.createdAt));
  process.exit(0);
}
check();
