const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  challengeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Challenge', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  repositoryUrl: { type: String }, // Optional: Github Link
  code: { type: String },          // Optional: Direct Code Paste
  language: { type: String, default: 'javascript' },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
