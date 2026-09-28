const Agent = require('../models/Agent');
const ObdCode = require('../models/ObdCode');
const CodeLog = require('../models/CodeLog');
const decodeDtc = require('../utils/decodeDtc');

const STATUSES = ['Active', 'Inactive', 'Maintenance'];

// there is only one agent, create it the first time
const getAgent = async () => {
    const agent = await Agent.findOne();
    return agent || Agent.create({ name: 'Auto-Code Assistant' });
};

const toLines = (text) => String(text || '').split('\n').map((l) => l.trim()).filter(Boolean);

// ----- User side -----

const index = async (req, res) => {
    const agent = await getAgent();
    res.render('agent/index.ejs', { agent, question: '', answer: null, sent: req.query.sent === '1' });
};

const ask = async (req, res) => {
    const agent = await getAgent();
    const question = String(req.body.question || '').trim().slice(0, 500);

    if (agent.status !== 'Active' || !question) {
        return res.render('agent/index.ejs', { agent, question, answer: null, sent: false });
    }

    const found = [...new Set(question.toUpperCase().match(/\b[PBCU][0-9A-F]{4}\b/g) || [])];
    const codes = await ObdCode.find({ code: { $in: found } });
    const unknown = found
        .filter((c) => !codes.some((k) => k.code === c))
        .map((c) => ({ code: c, text: decodeDtc(c) }));

    const words = question.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
    const knowledge = agent.knowledge
        .filter((k) => k.approved)
        .filter((k) => words.some((w) => `${k.topic} ${k.content}`.toLowerCase().includes(w)))
        .slice(0, 3);

    // no code in the question, so show the user's open faults instead
    const openLogs = found.length
        ? []
        : await CodeLog.find({ user: req.session.user._id, status: { $ne: 'Resolved' } }).populate('car').limit(5);

    const summary = codes.map((c) => `${c.code}: ${c.name}`).join(', ') || 'No matching code';

    res.render('agent/index.ejs', {
        agent,
        question,
        answer: { codes, unknown, knowledge, openLogs, summary },
        sent: false
    });
};

const sendFeedback = async (req, res) => {
    const agent = await getAgent();
    const question = String(req.body.question || '').trim();
    const correction = String(req.body.correction || '').trim();
    if (question && correction) {
        agent.feedback.push({ question, answer: req.body.answer || 'No answer', correction });
        await agent.save();
    }
    res.redirect('/agent?sent=1');
};

// ----- Admin side -----

// codes users logged that are not in the database yet
const getUnknownCodes = async () => {
    const logged = await CodeLog.distinct('code');
    const known = await ObdCode.distinct('code', { code: { $in: logged } });
    return logged.filter((c) => !known.includes(c)).map((c) => ({ code: c, text: decodeDtc(c) }));
};

const admin = async (req, res) => {
    const agent = await getAgent();
    const unknownCodes = await getUnknownCodes();
    res.render('agent/admin.ejs', { agent, statuses: STATUSES, unknownCodes });
};

const addCode = async (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase();
    const { name, problem, solution, severity } = req.body;
    if (/^[PBCU][0-9A-F]{4}$/.test(code) && name) {
        await ObdCode.updateOne(
            { code },
            { $set: { code, name, category: code[0], problem, solution, severity } },
            { upsert: true, runValidators: true }
        );
        // logs that were saved before the code was known get its severity now
        await CodeLog.updateMany({ code, severity: 'unknown' }, { severity });
    }
    res.redirect('/agent/admin');
};

const updateAgent = async (req, res) => {
    const agent = await getAgent();
    if (req.body.name) agent.name = req.body.name;
    if (STATUSES.includes(req.body.status)) agent.status = req.body.status;
    agent.instructions = toLines(req.body.instructions);
    agent.updatedBy = req.session.user._id;
    await agent.save();
    res.redirect('/agent/admin');
};

const addKnowledge = async (req, res) => {
    const agent = await getAgent();
    const { topic, content } = req.body;
    if (topic && content) {
        agent.knowledge.push({ topic, content, source: 'user', approved: true });
        agent.updatedBy = req.session.user._id;
        await agent.save();
    }
    res.redirect('/agent/admin');
};

const deleteKnowledge = async (req, res) => {
    const agent = await getAgent();
    const item = agent.knowledge.id(req.params.kid);
    if (item) {
        item.deleteOne();
        await agent.save();
    }
    res.redirect('/agent/admin');
};

// approving a correction turns it into knowledge the agent can use
const approveFeedback = async (req, res) => {
    const agent = await getAgent();
    const item = agent.feedback.id(req.params.fid);
    if (item) {
        agent.knowledge.push({ topic: item.question, content: item.correction, source: 'user', approved: true });
        item.deleteOne();
        agent.updatedBy = req.session.user._id;
        await agent.save();
    }
    res.redirect('/agent/admin');
};

const rejectFeedback = async (req, res) => {
    const agent = await getAgent();
    const item = agent.feedback.id(req.params.fid);
    if (item) {
        item.deleteOne();
        await agent.save();
    }
    res.redirect('/agent/admin');
};

module.exports = {
    index, ask, sendFeedback,
    admin, updateAgent, addKnowledge, deleteKnowledge, approveFeedback, rejectFeedback, addCode
};
