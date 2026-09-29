const mongoose = require('mongoose');

const obdCodeSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        category: { type: String, enum: ['P', 'B', 'C', 'U'] },
        problem: { type: String, trim: true },
        solution: { type: String, trim: true },
        severity: { type: String, enum: ['drive', 'soon', 'stop'], default: 'soon' }
    },
    { timestamps: true }
);

obdCodeSchema.pre('save', function () {
    if (!this.category) this.category = this.code.charAt(0);
});

module.exports = mongoose.model('ObdCode', obdCodeSchema);
