const mongoose = require('mongoose');
const Car = require('../models/Car');
const Owner = require('../models/Owner');
const CodeLog = require('../models/CodeLog');
const ObdCode = require('../models/ObdCode');
const Maintenance = require('../models/Maintenance');
const decodeDtc = require('../utils/decodeDtc');
const { carHealth } = require('../utils/health');
const { findCarImage } = require('../utils/carImage');
const { MODELS } = require('../utils/carModels');
const { SERVICES, nextServices, describeDue } = require('../utils/service');
const { beforeYouGo, checkClaim, isArabic, URGENCY_ORDER } = require('../utils/diagnosis');

const STATUSES = ['Open', 'In Progress', 'Resolved'];

const MAKES = ['Toyota', 'Nissan', 'Lexus', 'Honda', 'Hyundai', 'Kia', 'Mitsubishi', 'Mazda', 'Ford', 'Chevrolet', 'GMC', 'Dodge', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Land Rover', 'Other'];
const YEARS = Array.from({ length: new Date().getFullYear() + 1 - 1990 + 1 }, (_, i) => new Date().getFullYear() + 1 - i);
const formOptions = { makes: MAKES, years: YEARS, models: MODELS };

const isOpen = (log) => log.status !== 'Resolved';
const worstOf = (logs) => URGENCY_ORDER.find((level) => logs.some((l) => l.severity === level)) || null;
const pickModel = (body) => (body.modelPick && body.modelPick !== 'Other' ? body.modelPick : body.modelOther || body.model);
const toMileage = (value) => (value === '' || value == null ? undefined : Number(value));

const getOwner = (req) => Owner.findOneAndUpdate(
    { user: req.session.user._id },
    { $setOnInsert: { fullName: req.session.user.username } },
    { upsert: true, returnDocument: 'after' }
);

const findMyCar = async (req) => {
    if (!mongoose.isValidObjectId(req.params.id)) return null;
    const owner = await getOwner(req);
    return Car.findOne({ _id: req.params.id, owner: owner._id });
};

const index = async (req, res) => {
    try {
        const owner = await getOwner(req);
        const cars = await Car.find({ owner: owner._id }).sort({ createdAt: -1 });
        await Promise.all(cars.filter((c) => c.image == null).map(async (c) => {
            const image = await findCarImage(c.make, c.model, c.year);
            if (image === undefined) return;
            c.image = image;
            await c.save();
        }));
        const carIds = cars.map((c) => c._id);
        const [logs, services] = await Promise.all([
            CodeLog.find({ car: { $in: carIds } }).sort({ createdAt: -1 }),
            Maintenance.find({ car: { $in: carIds } })
        ]);

        const cards = cars.map((car) => {
            const carLogs = logs.filter((l) => l.car.equals(car._id));
            const open = carLogs.filter(isOpen);
            const due = nextServices(car, services.filter((s) => s.car.equals(car._id)));
            return {
                car,
                open: open.length,
                worst: worstOf(open),
                health: carHealth(open, due),
                nextService: due[0] ? { ...due[0], text: describeDue(due[0]) } : null,
                lastLog: carLogs[0] || null
            };
        });

        const stats = {
            cars: cars.length,
            open: logs.filter(isOpen).length,
            fixed: logs.filter((l) => !isOpen(l)).length
        };
        const recent = logs.slice(0, 5).map((log) => ({ log, car: cars.find((c) => c._id.equals(log.car)) }));

        res.render('garage/index.ejs', { cards, stats, recent });
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
        const { make, year, vin, mileage } = req.body;
        const model = pickModel(req.body);
        const image = await findCarImage(make, model, year);
        const car = await Car.create({ make, model, year, vin: vin || undefined, mileage: toMileage(mileage), image, owner: owner._id });
        res.redirect(`/garage/${car._id}`);
    } catch (error) {
        res.status(400).render('garage/new.ejs', { ...formOptions, error: error.message });
    }
};

const renderCar = async (req, res, car, extra = {}) => {
    const [logs, services] = await Promise.all([
        CodeLog.find({ car: car._id }).sort({ createdAt: -1 }),
        Maintenance.find({ car: car._id }).sort({ date: -1 })
    ]);
    const codes = await ObdCode.find({ code: { $in: logs.map((l) => l.code) } });
    const info = Object.fromEntries(codes.map((c) => [c.code, c]));
    const open = logs.filter(isOpen);
    const due = nextServices(car, services).map((s) => ({ ...s, text: describeDue(s) }));
    const cards = [...new Set(open.map((l) => l.code))].map((code) => ({
        code,
        name: info[code] ? info[code].name : decodeDtc(code),
        severity: (open.find((l) => l.code === code) || {}).severity,
        ...beforeYouGo(code)
    }));

    res.render('garage/show.ejs', {
        car, logs, info, decodeDtc, services, due, cards,
        health: carHealth(open, due),
        serviceTypes: SERVICES,
        statuses: STATUSES,
        error: req.query.error || null,
        claim: null,
        claimText: '',
        ...extra
    });
};

const showCar = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        await renderCar(req, res, car);
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
        const { make, year, vin, mileage } = req.body;
        const model = pickModel(req.body);
        const renamed = make !== car.make || model !== car.model || Number(year) !== car.year;
        Object.assign(car, { make, model, year, vin: vin || undefined, mileage: toMileage(mileage) });
        if (renamed) car.image = await findCarImage(make, model, year);
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
            await Maintenance.deleteMany({ car: car._id });
            await car.deleteOne();
        }
        res.redirect('/garage');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

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

const addService = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        const { serviceType, date, mileage, cost, garage, notes } = req.body;
        if (!SERVICES[serviceType]) return res.redirect(`/garage/${car._id}?error=Pick a service type`);
        const km = toMileage(mileage);
        await Maintenance.create({
            car: car._id,
            serviceType,
            date: date ? new Date(date) : new Date(),
            mileage: km,
            cost: cost === '' || cost == null ? undefined : Number(cost),
            garage,
            notes
        });
        if (km != null && (car.mileage == null || km > car.mileage)) {
            car.mileage = km;
            await car.save();
        }
        res.redirect(`/garage/${car._id}#services`);
    } catch (error) {
        console.log(error);
        res.redirect(`/garage/${req.params.id}?error=${encodeURIComponent(error.message)}`);
    }
};

const deleteService = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car || !mongoose.isValidObjectId(req.params.serviceId)) return res.redirect('/garage');
        await Maintenance.deleteOne({ _id: req.params.serviceId, car: car._id });
        res.redirect(`/garage/${car._id}#services`);
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const checkGarage = async (req, res) => {
    try {
        const car = await findMyCar(req);
        if (!car) return res.status(404).render('error.ejs', { message: 'Car not found' });
        const text = String(req.body.claim || '').trim().slice(0, 300);
        if (!text) return res.redirect(`/garage/${car._id}`);
        const [openLogs, lastOil] = await Promise.all([
            CodeLog.find({ car: car._id, status: { $ne: 'Resolved' } }),
            Maintenance.findOne({ car: car._id, serviceType: 'oil' }).sort({ date: -1 })
        ]);
        const claim = checkClaim({
            text,
            openCodes: [...new Set(openLogs.map((l) => l.code))],
            lastOil,
            carMileage: car.mileage,
            lang: isArabic(text) ? 'ar' : 'en',
            gender: req.session.user.gender
        });
        await renderCar(req, res, car, { claim, claimText: text });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

module.exports = {
    index, newCar, createCar, showCar, editCar, updateCar, deleteCar,
    addLog, updateLog, deleteLog, addService, deleteService, checkGarage
};
