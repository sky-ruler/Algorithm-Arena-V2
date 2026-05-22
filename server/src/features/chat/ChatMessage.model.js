const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  clanId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Clan', required: true, index: true },
  sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 2000 },
  isDoubt: { type: Boolean, default: false },
}, { timestamps: true });

chatMessageSchema.index({ clanId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
