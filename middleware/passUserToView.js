const User = require('../models/User');
const { canControlAgent } = require('../utils/roles');

const passUserToView = async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id).select('username role gender level agentAccess agentAccessUntil');
    if (!user) return req.session.destroy(() => res.redirect('/auth/login'));
    req.session.user.username = user.username;
    req.session.user.role = user.role;
    req.session.user.gender = user.gender;
    req.session.user.level = user.level;
    req.session.user.canControlAgent = canControlAgent(user);
  }
  res.locals.user = req.session.user ? req.session.user : null;
  res.locals.path = req.path;
  next();
};

module.exports = passUserToView;
