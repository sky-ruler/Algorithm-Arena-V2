require('dotenv').config();
const mongoose = require('mongoose');
const { env } = require('./config/env');
const Challenge = require('./src/features/challenges/Challenge.model');
const Submission = require('./src/features/submissions/Submission.model');

async function test() {
  if (process.env.NODE_ENV === 'production') {
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  }
  await mongoose.connect(env.MONGO_URI);
  
  const subs = await Submission.find({ challengeId: '6a394cd58141abf32294e83a' })
    .populate('challengeId', 'title difficulty points')
    .sort({ submittedAt: -1 })
    .limit(10);
    
  console.log(JSON.stringify(subs, null, 2));
  process.exit(0);
}
test();
