module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'superowner') return next();
    res.status(403).render('error.ejs', { message: 'Super owner only' });
};
