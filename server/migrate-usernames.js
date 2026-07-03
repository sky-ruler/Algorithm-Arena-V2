require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/features/users/User.model');

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/algoarena')
  .then(async () => {
    console.log('Connected to database. Checking for uppercase usernames...');
    const users = await User.find({});
    let updated = 0;
    
    for (const user of users) {
      if (user.username && user.username !== user.username.toLowerCase()) {
        const lowerUsername = user.username.toLowerCase();
        
        // Check if there is already a conflicting user with the lowercase username
        const conflictingUser = await User.findOne({ username: lowerUsername, _id: { $ne: user._id } });
        
        if (conflictingUser) {
          console.warn(`WARNING: Cannot migrate ${user.username} to ${lowerUsername} as it already exists in the database.`);
        } else {
          user.username = lowerUsername;
          await user.save({ validateBeforeSave: false });
          updated++;
          console.log(`Migrated username: ${user.username}`);
        }
      }
    }
    
    console.log(`Successfully updated ${updated} existing users to lowercase username.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
