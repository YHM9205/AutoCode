const WINDOW = 15 * 60 * 1000;
const MAX_TRIES = 10;
const tries = new Map();

const loginLimiter = (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const entry = tries.get(key);
    if (!entry || now - entry.start > WINDOW) {
        tries.set(key, { start: now, count: 1 });
        return next();
    }
    entry.count += 1;
    if (entry.count > MAX_TRIES) {
        return res.status(429).render('auth/login.ejs', {
            error: 'Too many login attempts. Please wait 15 minutes and try again.',
            identifier: typeof req.body.username === 'string' ? req.body.username : ''
        });
    }
    next();
};

setInterval(() => {
    const now = Date.now();
    tries.forEach((entry, key) => {
        if (now - entry.start > WINDOW) tries.delete(key);
    });
}, WINDOW).unref();

module.exports = loginLimiter;
