const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 🎯 Get the email from the command line argument
const targetEmail = process.argv[2]; 

if (!targetEmail) {
  console.log('❌ Error: Please provide an email address.');
  console.log('Usage: node makeAdmin.js student@example.com');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: targetEmail.toLowerCase().trim() },
      { role: 'admin' },
      { returnDocument: 'after' } // The modern way to get the updated user
    );

    if (user) {
      console.log(`🎉 Success! ${user.username} is now an ADMIN.`);
    } else {
      console.log(`❌ No user found with email: ${targetEmail}`);
    }
    
    mongoose.disconnect();
  })
  .catch(err => console.error(err));