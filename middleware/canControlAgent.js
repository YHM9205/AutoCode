// set by passUserToView from the database on every request
module.exports = (req, res, next) => {
    if (req.session.user && req.session.user.canControlAgent) return next();
    res.status(403).send('You do not have access to Agent Control');
};
