const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  agentName: { type: String, default: 'Auto-Code Autonomous Agent' },
  status: { type: String, default: 'active' },
  allowedUsers: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'admin', 'temp'], default: 'temp' },
    expiresAt: { type: Date }
  }],
  logs: {
    message: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
