const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['user','assistant','system'], default: 'user' },
  text: { type: String, required: true },
  meta: { type: Object, default: {} }, // for tokens, provider info
  createdAt: { type: Date, default: Date.now }
});

MessageSchema.index({ sessionId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
