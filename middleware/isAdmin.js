module.exports = (req, res, next) => {
    const role = req.session.user && req.session.user.role;
    if (role === 'admin' || role === 'superowner') return next();
    res.status(403).send('Admins only');
};
