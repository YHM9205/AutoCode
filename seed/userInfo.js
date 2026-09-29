// Run: node seed/userInfo.js              -> list all users
//      node seed/userInfo.js <username|email|id>  -> one user with their cars and logs, as JSON
// For the site owner only: it reads the database directly, the app never shows this to anyone
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Owner = require('../models/Owner');
const Car = require('../models/Car');
const CodeLog = require('../models/CodeLog');

(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const search = process.argv[2];

    if (!search) {
        const users = await User.find().select('username email role').sort({ createdAt: 1 }).lean();
        console.table(users.map((u) => ({ id: String(u._id), username: u.username, email: u.email, role: u.role })));
        return mongoose.disconnect();
    }

    const user = await User.findOne(
        mongoose.isValidObjectId(search) ? { _id: search } : { $or: [{ username: search }, { email: search.toLowerCase() }] }
    ).select('-password -__v').lean();

    if (!user) {
        console.log(`No user found for "${search}"`);
        return mongoose.disconnect();
    }

    const owner = await Owner.findOne({ user: user._id }).select('-__v').lean();
    const cars = owner ? await Car.find({ owner: owner._id }).select('-__v -owner').lean() : [];
    const logs = await CodeLog.find({ user: user._id }).select('-__v -user').lean();

    // each car with its own logs under it
    const garage = cars.map((car) => ({
        ...car,
        logs: logs.filter((l) => String(l.car) === String(car._id)).map(({ car: _car, ...log }) => log)
    }));

    console.log(JSON.stringify({ user, owner, cars: garage }, null, 2));
    await mongoose.disconnect();
})();
