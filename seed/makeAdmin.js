// Run: node seed/makeAdmin.js <username>
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
    const username = process.argv[2];
    if (!username) {
        console.log('Usage: node seed/makeAdmin.js <username>');
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    const result = await User.updateOne({ username }, { role: 'admin' });
    console.log(result.matchedCount ? `${username} is now an admin` : `No user named ${username}`);
    await mongoose.disconnect();
})();
