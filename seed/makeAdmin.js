require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ROLES = ['moderator', 'admin', 'superowner'];

(async () => {
    const username = (process.argv[2] || '').toLowerCase();
    const role = process.argv[3] || 'admin';
    if (!username || !ROLES.includes(role)) {
        console.log(`Usage: node seed/makeAdmin.js <username> [${ROLES.join('|')}]`);
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.updateOne({ username }, { role });
    console.log(result.matchedCount ? `${username} is now ${role}` : `No user named ${username}`);
    await mongoose.disconnect();
})();
