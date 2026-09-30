const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const ObdCode = require('../models/ObdCode');
const CodeLog = require('../models/CodeLog');
const Owner = require('../models/Owner');
const Car = require('../models/Car');
const decodeDtc = require('../utils/decodeDtc');
const { think, reply, isArabic, findPart, partReply } = require('../utils/diagnosis');

const STATUSES = ['Active', 'Inactive', 'Maintenance'];

const getAgent = async () => {
    const agent = await Agent.findOne();
    return agent || Agent.create({ name: 'Auto-Code Assistant' });
};

const toLines = (text) => String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);

const SEVERITY_ORDER = ['stop', 'soon', 'unknown', 'drive'];

const getMyCars = async (req) => {
    const owner = await Owner.findOne({ user: req.session.user._id });
    return owner ? Car.find({ owner: owner._id }).sort({ createdAt: -1 }) : [];
};

const codeHistory = async (req, code, car) => {
    const mine = await CodeLog.find({ user: req.session.user._id, code, ...(car && { car: car._id }) })
        .sort({ updatedAt: -1 });
    const others = await CodeLog.aggregate([
        { $match: { code, user: { $ne: new mongoose.Types.ObjectId(String(req.session.user._id)) } } },
        { $lookup: { from: 'cars', localField: 'car', foreignField: '_id', as: 'car' } },
        { $unwind: '$car' },
        ...(car ? [{ $match: { 'car.make': car.make } }] : []),
        { $group: { _id: '$user' } },
        { $count: 'users' }
    ]);
    const lastFixed = mine.find((l) => l.status === 'Resolved');
    return {
        times: mine.length,
        lastFixed: lastFixed ? lastFixed.updatedAt : null,
        openOnCar: Boolean(car) && mine.some((l) => l.status !== 'Resolved'),
        others: others.length ? others[0].users : 0
    };
};

const diagnose = async (req, question, car, skip) => {
    const thought = think(question);
    if (!thought.matched.length) return null;

    const top = thought.candidates.filter((c) => !skip.includes(c.code)).slice(0, 8);
    const codes = top.map((c) => c.code);
    const [info, community, mine] = await Promise.all([
        ObdCode.find({ code: { $in: codes } }),
        CodeLog.aggregate([
            { $match: { code: { $in: codes } } },
            { $lookup: { from: 'cars', localField: 'car', foreignField: '_id', as: 'car' } },
            { $unwind: '$car' },
            ...(car ? [{ $match: { 'car.make': car.make } }] : []),
            { $group: { _id: '$code', count: { $sum: 1 } } }
        ]),
        CodeLog.distinct('code', { user: req.session.user._id, code: { $in: codes }, ...(car && { car: car._id }) })
    ]);

    const suggestions = top.map((c) => {
        const seen = (community.find((x) => x._id === c.code) || {}).count || 0;
        const hadBefore = mine.includes(c.code);
        const code = info.find((k) => k.code === c.code);
        return {
            code: c.code,
            name: code ? code.name : decodeDtc(c.code),
            severity: code ? code.severity : 'unknown',
            solution: code ? code.solution : null,
            because: c.because,
            seen,
            hadBefore,
            score: c.score + Math.min(seen, 5) * 0.6 + (hadBefore ? 2 : 0)
        };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    const total = suggestions.reduce((sum, s) => sum + s.score, 0);
    suggestions.forEach((s) => { s.confidence = Math.round((s.score / total) * 100); });

    return { symptoms: thought.matched, urgency: thought.urgency, suggestions };
};

const index = async (req, res) => {
    try {
        const agent = await getAgent();
        const cars = await getMyCars(req);
        let chat = req.session.agentChat || { turns: [] };
        const picked = cars.find((c) => String(c._id) === req.query.car);
        if (picked && chat.carId !== String(picked._id)) chat = { turns: [] };
        res.render('agent/index.ejs', {
            agent, cars, carId: picked ? String(picked._id) : chat.carId || '', question: '', answer: null, turns: chat.turns, sent: req.query.sent === '1'
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const ask = async (req, res) => {
    try {
        const agent = await getAgent();
        const cars = await getMyCars(req);
        const question = String(req.body.question || '').trim().slice(0, 500);
        const car = cars.find((c) => String(c._id) === req.body.carId) || null;
        const carId = car ? String(car._id) : '';

        let chat = req.session.agentChat;
        if (!chat || chat.carId !== carId) chat = { carId, turns: [], context: [], asked: [] };

        if (agent.status !== 'Active' || !question) {
            return res.render('agent/index.ejs', { agent, cars, carId, question, answer: null, turns: chat.turns, sent: false });
        }

        chat.context = [...chat.context, question].slice(-4);

        const found = [...new Set(question.toUpperCase().match(/\b[PBCU][0-9A-F]{4}\b/g) || [])];
        const known = await ObdCode.find({ code: { $in: found } });
        const results = await Promise.all(found.map(async (code) => {
            const info = known.find((k) => k.code === code);
            return {
                code,
                name: info ? info.name : decodeDtc(code),
                severity: info ? info.severity : 'unknown',
                problem: info ? info.problem : null,
                solution: info ? info.solution : 'This code is not in our database yet, have it checked at a workshop.',
                history: await codeHistory(req, code, car)
            };
        }));
        const analysis = await diagnose(req, chat.context, car, found);
        const levels = [...results.map((r) => r.severity), ...(analysis ? [analysis.urgency] : [])];
        const verdict = SEVERITY_ORDER.find((s) => levels.includes(s)) || null;

        const words = question.toLowerCase().split(/[\s.,!?؟،:;()]+/).filter((w) => w.length > 2);
        const knowledge = agent.knowledge
            .filter((k) => k.approved)
            .filter((k) => words.some((w) => `${k.topic} ${k.content}`.toLowerCase().includes(w)))
            .slice(0, 3);

        const openLogs = found.length || analysis || findPart(question)
            ? []
            : await CodeLog.find({
                user: req.session.user._id,
                status: { $ne: 'Resolved' },
                ...(car && { car: car._id })
            }).populate('car').limit(5);

        const top = results.length
            ? { code: results[0].code, name: results[0].name, hadBefore: results[0].history.times > 0, seen: results[0].history.others }
            : analysis && analysis.suggestions[0];
        const lang = isArabic(question) ? 'ar' : 'en';
        const part = findPart(question);
        const diagnosis = top || analysis
            ? reply({
                lang,
                symptoms: analysis ? analysis.symptoms : [],
                top,
                urgency: verdict,
                carName: car ? `${car.make} ${car.model}` : null,
                asked: chat.asked,
                gender: req.session.user.gender,
                level: req.session.user.level
            })
            : null;
        const said = part || diagnosis
            ? {
                text: [part && partReply(part, lang), diagnosis && diagnosis.text].filter(Boolean).join(' '),
                followUp: diagnosis ? diagnosis.followUp : null
            }
            : null;

        const previous = chat.turns;
        if (said) {
            if (said.followUp) chat.asked = [...chat.asked, said.followUp.id];
            chat.turns = [...chat.turns, { q: question, a: said.text, f: said.followUp ? said.followUp.text : null }].slice(-6);
        }
        req.session.agentChat = chat;

        const summary = [...results, ...(analysis ? analysis.suggestions : [])]
            .map((r) => `${r.code}: ${r.name}`).join(', ') || 'No matching code';

        res.render('agent/index.ejs', {
            agent, cars, carId, car, question, turns: previous,
            answer: { said, results, analysis, verdict, knowledge, openLogs, summary },
            sent: false
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const newChat = (req, res) => {
    delete req.session.agentChat;
    res.redirect('/agent');
};

const sendFeedback = async (req, res) => {
    try {
        const agent = await getAgent();
        const question = String(req.body.question || '').trim();
        const correction = String(req.body.correction || '').trim();
        if (question && correction) {
            agent.feedback.push({ question, answer: req.body.answer || 'No answer', correction });
            await agent.save();
        }
        res.redirect('/agent?sent=1');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const getUnknownCodes = async () => {
    const logged = await CodeLog.distinct('code');
    const known = await ObdCode.distinct('code', { code: { $in: logged } });
    return logged.filter((c) => !known.includes(c)).map((c) => ({ code: c, text: decodeDtc(c) }));
};

const admin = async (req, res) => {
    try {
        const agent = await getAgent();
        const unknownCodes = await getUnknownCodes();
        res.render('agent/admin.ejs', { agent, statuses: STATUSES, unknownCodes });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const addCode = async (req, res) => {
    try {
        const code = String(req.body.code || '').trim().toUpperCase();
        const { name, problem, solution, severity } = req.body;
        if (/^[PBCU][0-9A-F]{4}$/.test(code) && name) {
            await ObdCode.updateOne(
                { code },
                { $set: { code, name, category: code[0], problem, solution, severity } },
                { upsert: true, runValidators: true }
            );
            await CodeLog.updateMany({ code, severity: 'unknown' }, { severity });
        }
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const updateAgent = async (req, res) => {
    try {
        const agent = await getAgent();
        if (req.body.name) agent.name = req.body.name;
        if (STATUSES.includes(req.body.status)) agent.status = req.body.status;
        agent.instructions = toLines(req.body.instructions);
        agent.updatedBy = req.session.user._id;
        await agent.save();
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const addKnowledge = async (req, res) => {
    try {
        const agent = await getAgent();
        const { topic, content } = req.body;
        if (topic && content) {
            agent.knowledge.push({ topic, content, source: 'user', approved: true });
            agent.updatedBy = req.session.user._id;
            await agent.save();
        }
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const deleteKnowledge = async (req, res) => {
    try {
        const agent = await getAgent();
        const item = agent.knowledge.id(req.params.kid);
        if (item) {
            item.deleteOne();
            await agent.save();
        }
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const approveFeedback = async (req, res) => {
    try {
        const agent = await getAgent();
        const item = agent.feedback.id(req.params.fid);
        if (item) {
            agent.knowledge.push({ topic: item.question, content: item.correction, source: 'user', approved: true });
            item.deleteOne();
            agent.updatedBy = req.session.user._id;
            await agent.save();
        }
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const rejectFeedback = async (req, res) => {
    try {
        const agent = await getAgent();
        const item = agent.feedback.id(req.params.fid);
        if (item) {
            item.deleteOne();
            await agent.save();
        }
        res.redirect('/agent/admin');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

module.exports = {
    index, ask, newChat, sendFeedback,
    admin, updateAgent, addKnowledge, deleteKnowledge, approveFeedback, rejectFeedback, addCode
};
