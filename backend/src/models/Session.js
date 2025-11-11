const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  metadata: { type: Object, default: {} },
  ttl: { type: Number, default: 1000 * 60 * 60 * 24 * 7 } // optional TTL in ms
});

module.exports = mongoose.model('Session', SessionSchema);
