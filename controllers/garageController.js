const Car = require('../models/Car');
const Owner = require('../models/Owner');
const CodeLog = require('../models/CodeLog');
const ObdCode = require('../models/ObdCode');
const decodeDtc = require('../utils/decodeDtc');

const getOwner = (req) => Owner.findOneAndUpdate(
    { user: req.session.user._id },
    { $setOnInsert: { fullName: req.session.user.username } },
    { upsert: true, new: true }
);

const findMyCar = async (req) => {
    const owner = await getOwner(req);
    if (!owner) return null;
    return Car.findOne({ _id: req.params.id, owner: owner._id });
};

const index = async (req, res) => {
    const owner = await getOwner(req);
    const cars = owner ? await Car.find({ owner: owner._id }).sort({ createdAt: -1 }) : [];
    res.render('garage/index.ejs', { cars });
};

const newCar = (req, res) => {
    res.render('garage/new.ejs', { error: null });
};

const createCar = async (req, res) => {
    try {
        const owner = await getOwner(req);
        const { make, model, year, vin } = req.body;
        const car = await Car.create({ make, model, year, vin: vin || undefined, owner: owner._id });
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        res.status(400).render('garage/new.ejs', { error: error.message });
    }
};

const showCar = async (req, res) => {
    const car = await findMyCar(req);
    if (!car) return res.status(404).send('Car not found');
    const logs = await CodeLog.find({ car: car._id }).sort({ createdAt: -1 });
    const codes = await ObdCode.find({ code: { $in: logs.map((l) => l.code) } });
    const info = Object.fromEntries(codes.map((c) => [c.code, c]));
    res.render('garage/show.ejs', { car, logs, info, decodeDtc, statuses: STATUSES, error: req.query.error || null });
};

const deleteCar = async (req, res) => {
    const car = await findMyCar(req);
    if (car) {
        await CodeLog.deleteMany({ car: car._id });
        await car.deleteOne();
    }
    res.redirect('/garage');
};

const addLog = async (req, res) => {
    const car = await findMyCar(req);
    if (!car) return res.status(404).send('Car not found');
    const code = String(req.body.code || '').trim().toUpperCase();
    if (!/^[PBCU][0-9A-F]{4}$/.test(code)) {
        return res.redirect(`/garage/${car._id}?error=Invalid code format (example: P0300)`);
    }
    const known = await ObdCode.findOne({ code });
    await CodeLog.create({
        user: req.session.user._id,
        car: car._id,
        code,
        severity: known ? known.severity : 'unknown',
        note: req.body.note
    });
    res.redirect(`/garage/${car._id}`);
};

const STATUSES = ['Open', 'In Progress', 'Resolved'];

const editCar = async (req, res) => {
    const car = await findMyCar(req);
    if (!car) return res.status(404).send('Car not found');
    res.render('garage/edit.ejs', { car, error: null });
};

const updateCar = async (req, res) => {
    const car = await findMyCar(req);
    if (!car) return res.status(404).send('Car not found');
    try {
        const { make, model, year, vin } = req.body;
        Object.assign(car, { make, model, year, vin: vin || undefined });
        await car.save();
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        res.status(400).render('garage/edit.ejs', { car, error: error.message });
    }
};

const updateLog = async (req, res) => {
    const log = await CodeLog.findOne({ _id: req.params.logId, car: req.params.id, user: req.session.user._id });
    if (log) {
        if (STATUSES.includes(req.body.status)) log.status = req.body.status;
        if (typeof req.body.note === 'string') log.note = req.body.note;
        await log.save();
    }
    res.redirect(`/garage/${req.params.id}`);
};

const deleteLog = async (req, res) => {
    await CodeLog.deleteOne({ _id: req.params.logId, car: req.params.id, user: req.session.user._id });
    res.redirect(`/garage/${req.params.id}`);
};

// every code this user has logged, across all their cars
const myLogs = async (req, res) => {
    const logs = await CodeLog.find({ user: req.session.user._id }).populate('car').sort({ createdAt: -1 });
    res.render('garage/logs.ejs', { logs });
};

module.exports = { index, newCar, createCar, showCar, editCar, updateCar, deleteCar, addLog, updateLog, deleteLog, myLogs };
