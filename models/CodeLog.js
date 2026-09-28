const mongoose = require('mongoose');

// One entry every time a user records a code for one of their cars
const codeLogSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
        code: { type: String, required: true, uppercase: true, trim: true, match: /^[PBCU][0-9A-F]{4}$/ },
        severity: { type: String, enum: ['drive', 'soon', 'stop', 'unknown'], default: 'unknown' },
        note: { type: String, trim: true, maxlength: 500 },
        status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('CodeLog', codeLogSchema);
