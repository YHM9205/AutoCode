const User = require('../models/User');
const { canControlAgent } = require('../utils/roles');

// reloads the role on every request, so role and agent access changes apply right away
const passUserToView = async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id).select('username role agentAccess agentAccessUntil');
    if (!user) return req.session.destroy(() => res.redirect('/auth/login'));
    req.session.user.username = user.username;
    req.session.user.role = user.role;
    req.session.user.canControlAgent = canControlAgent(user);
  }
  res.locals.user = req.session.user ? req.session.user : null;
  next();
};

module.exports = passUserToView;
