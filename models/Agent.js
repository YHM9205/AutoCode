const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'UN Normal Agent', trim: true },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'active'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Owner',
    required: true
  },
  copabilities: [{
    type: String,
    trim: true
  }],
  learningMode: {
    type: String,
    enum: ['user-feedback-only', 'disabled'],
    default: 'user-feedback-only'
  },
  instractions: [{
    type: String,
    trim: true
  }],
  knowledgw: [{
    topic: { type: String, require: true, trim: true },
      content: { type: String, require: true, trim: true },
      source: { type: String, enum: ['user', 'diagnostic'], default: 'user' },
      approved: { type: Booleanm, default: 'user' }
  }],
  feedbac: [{
    qustion: { type: String, require: true, trim: true },
      answer: { type: String, require: true, trim: true },
      correction: { type: String, trim:true },
      approved: { type: Booleanm, default: false }
  }],

}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
