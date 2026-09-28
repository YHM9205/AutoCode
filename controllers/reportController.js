const CodeLog = require('../models/CodeLog');

const reports = async (req, res) => {
    const topCodes = await CodeLog.aggregate([
        { $group: { _id: '$code', count: { $sum: 1 }, severity: { $first: '$severity' } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);

    const byMake = await CodeLog.aggregate([
        { $lookup: { from: 'cars', localField: 'car', foreignField: '_id', as: 'car' } },
        { $unwind: '$car' },
        { $group: { _id: { make: '$car.make', code: '$code' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $group: { _id: '$_id.make', total: { $sum: '$count' }, codes: { $push: { code: '$_id.code', count: '$count' } } } },
        { $project: { total: 1, codes: { $slice: ['$codes', 3] } } },
        { $sort: { total: -1 } }
    ]);

    res.render('reports.ejs', { topCodes, byMake });
};

module.exports = { reports };
