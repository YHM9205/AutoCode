const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
    {
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: true
        },
        serviceType: { type: String, required: true, trim: true },
        date: { type: Date, required: true, default: Date.now },
        mileage: { type: Number, min: 0 },
        cost: { type: Number, min: 0 },
        garage: { type: String, trim: true, maxlength: 100 },
        partsUsed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Part' }],
        notes: { type: String, trim: true, maxlength: 500 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
