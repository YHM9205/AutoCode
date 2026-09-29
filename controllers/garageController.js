const mongoose = require('mongoose');
const Car = require('../models/Car');
const Owner = require('../models/Owner');
const CodeLog = require('../models/CodeLog');
const ObdCode = require('../models/ObdCode');
const decodeDtc = require('../utils/decodeDtc');

const STATUSES = ['Open', 'In Progress', 'Resolved'];

// options for the car form dropdowns
const MAKES = ['Toyota', 'Nissan', 'Lexus', 'Honda', 'Hyundai', 'Kia', 'Mitsubishi', 'Mazda', 'Ford', 'Chevrolet', 'GMC', 'Dodge', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Land Rover', 'Other'];
const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 1990 + 1 }, (_, i) => new Date().getFullYear() + 1 - i);
const formOptions = { makes: MAKES, years: YEARS };

// finds the owner profile, creates it if the account does not have one
const getOwner = (req) => Owner.findOneAndUpdate(
    { user: req.session.user._id },
    { $setOnInsert: { fullName: req.session.user.username } },
    { upsert: true, returnDocument: 'after' }
);

// only returns the car if it belongs to the signed-in user
const findMyCar = async (req) => {
    if (!mongoose.isValidObjectId(req.params.id)) return null;
    const owner = await getOwner(req);
    return Car.findOne({ _id: req.params.id, owner: owner._id });
};

// ----- Cars -----

const index = async (req, res) => {
    try {
        const owner = await getOwner(req);
        const cars = await Car.find({ owner: owner._id }).sort({ createdAt: -1 });
        res.render('garage/index.ejs', { cars });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const newCar = (req, res) => {
    res.render('garage/new.ejs', { ...formOptions, error: null });
};

const createCar = async (req, res) => {
    try {
        const owner = await getOwner(req);
        const { make, model, year, vin } = req.body;
        const car = await Car.create({ make, model, year, vin: vin || undefined, owner: owner._id });
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        res.status(400).render('garage/new.ejs', { ...formOptions, error: error.message });
    }
};

const showCar = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        const logs = await CodeLog.find({ car: car._id }).sort({ createdAt: -1 });
        const codes = await ObdCode.find({ code: { $in: logs.map((l) => l.code) } });
        const info = Object.fromEntries(codes.map((c) => [c.code, c]));
        res.render('garage/show.ejs', { car, logs, info, decodeDtc, statuses: STATUSES, error: req.query.error || null });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const editCar = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        res.render('garage/edit.ejs', { ...formOptions, car, error: null });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const updateCar = async (req, res) => {
    let car;
    try {
        car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        const { make, model, year, vin } = req.body;
        Object.assign(car, { make, model, year, vin: vin || undefined });
        await car.save();
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        if (!car) return res.status(500).render('error.ejs', { message: 'Something went wrong' });
        res.status(400).render('garage/edit.ejs', { ...formOptions, car, error: error.message });
    }
};

const deleteCar = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (car) {
            await CodeLog.deleteMany({ car: car._id });
            await car.deleteOne();
        }
        res.redirect('/garage');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

// ----- Code logs -----

const addLog = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
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
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const updateLog = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car || !mongoose.isValidObjectId(req.params.logId)) return res.redirect('/garage');
        const log = await CodeLog.findOne({ _id: req.params.logId, car: car._id });
        if (log) {
            if (STATUSES.includes(req.body.status)) log.status = req.body.status;
            if (typeof req.body.note === 'string') log.note = req.body.note;
            await log.save();
        }
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const deleteLog = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car || !mongoose.isValidObjectId(req.params.logId)) return res.redirect('/garage');
        await CodeLog.deleteOne({ _id: req.params.logId, car: car._id });
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

module.exports = { index, newCar, createCar, showCar, editCar, updateCar, deleteCar, addLog, updateLog, deleteLog };
