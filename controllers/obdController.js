const ObdCode = require('../models/ObdCode');

const getAllCodes = async (req, res) => {
    try {
        const q = String(req.query.q || '').trim().toUpperCase();
        const filter = q ? { code: { $regex: '^' + q.replace(/[^A-Z0-9]/g, '') } } : {};
        const codes = await ObdCode.find(filter).sort({ code: 1 }).limit(100);
        res.render('obd/index.ejs', { codes, q });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = { getAllCodes };
