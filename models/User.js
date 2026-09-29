const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        password: {
            type: String,
            required: true,
            minlength: 60
        },
        role: {
            type: String,
            enum: ['user', 'owner', 'technician', 'moderator', 'admin', 'superowner'],
            default: 'user'
        },
        // access to Agent Control, given by the super owner
        agentAccess: {
            type: String,
            enum: ['none', 'temporary', 'permanent'],
            default: 'none'
        },
        agentAccessUntil: {
            type: Date
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
