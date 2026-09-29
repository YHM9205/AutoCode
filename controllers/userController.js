const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Owner = require('../models/Owner');
const Car = require('../models/Car');
const CodeLog = require('../models/CodeLog');
const { ASSIGNABLE_ROLES, isSuperOwner, isStaff, canControlAgent } = require('../utils/roles');

const isMe = (req) => req.params.id === String(req.session.user._id);

const canManage = (me, target) => {
    if (target._id.equals(me._id)) return true;
    if (isSuperOwner(me)) return true;
    return me.role === 'admin' && !isStaff(target) && !isSuperOwner(target);
};

const findUser = async (req) => {
    if (!mongoose.isValidObjectId(req.params.id)) return null;
    const target = await User.findById(req.params.id);
    return target && canManage(req.session.user, target) ? target : null;
};

const index = async (req, res) => {
    try {
        const id = String(req.query.id || '').trim();
        if (id) {
            const found = mongoose.isValidObjectId(id) && await User.exists({ _id: id });
            if (found) return res.redirect(`/users/${id}`);
        }
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.render('users/index.ejs', { users, id, canControlAgent, error: id ? 'No user with that id' : null });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const newUser = (req, res) => {
    res.render('users/new.ejs', { roles: ASSIGNABLE_ROLES, values: {}, error: null });
};

const create = async (req, res) => {
    const { username, email, password, role, fullName } = req.body;
    const values = { username, email, role, fullName };
    const fail = (error) => res.status(400).render('users/new.ejs', { roles: ASSIGNABLE_ROLES, values, error });
    try {
        if (String(password || '').length < 6) return fail('Password must be at least 6 characters');
        const user = await User.create({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            role: ASSIGNABLE_ROLES.includes(role) ? role : 'user'
        });
        await Owner.create({ user: user._id, fullName: String(fullName || '').trim() || user.username });
        res.redirect(`/users/${user._id}?saved=1`);
    } catch (error) {
        fail(error.code === 11000 ? 'Username or email already used' : error.message);
    }
};

const show = async (req, res) => {
    try {
        const shownUser = await findUser(req);
        if (!shownUser) return res.status(404).render('error.ejs', { message: 'User not found' });
        let cars = [];
        let logs = [];
        if (isMe(req) || isSuperOwner(req.session.user)) {
            const owner = await Owner.findOne({ user: shownUser._id });
            cars = owner ? await Car.find({ owner: owner._id }) : [];
            logs = await CodeLog.find({ user: shownUser._id }).populate('car').sort({ createdAt: -1 });
        }
        res.render('users/show.ejs', {
            shownUser, cars, logs,
            roles: ASSIGNABLE_ROLES,
            isMe: isMe(req),
            isSuperOwner: isSuperOwner(req.session.user),
            isStaffTarget: isStaff(shownUser),
            hasAgentAccess: canControlAgent(shownUser),
            saved: req.query.saved === '1',
            error: req.query.error || null
        });
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const update = async (req, res) => {
    try {
        const shownUser = await findUser(req);
        if (!shownUser) return res.status(404).render('error.ejs', { message: 'User not found' });
        const { username, email, role } = req.body;
        shownUser.username = username;
        shownUser.email = email;
        if (isMe(req)) {
            if (['male', 'female'].includes(req.body.gender)) shownUser.gender = req.body.gender;
            if (['beginner', 'intermediate', 'expert'].includes(req.body.level)) shownUser.level = req.body.level;
        }
        if (isSuperOwner(req.session.user) && !isMe(req) && ASSIGNABLE_ROLES.includes(role)) {
            shownUser.role = role;
            if (!isStaff(shownUser)) shownUser.agentAccess = 'none';
        }
        await shownUser.save();
        res.redirect(`/users/${shownUser._id}?saved=1`);
    } catch (error) {
        const message = error.code === 11000 ? 'Username or email already used' : error.message;
        res.redirect(`/users/${req.params.id}?error=${encodeURIComponent(message)}`);
    }
};

const updateAgentAccess = async (req, res) => {
    try {
        const shownUser = await findUser(req);
        if (!shownUser || !isSuperOwner(req.session.user)) return res.status(404).render('error.ejs', { message: 'User not found' });
        if (!isStaff(shownUser)) {
            return res.redirect(`/users/${shownUser._id}?error=Make this user an admin or moderator first`);
        }
        const { agentAccess, agentAccessUntil } = req.body;
        if (agentAccess === 'temporary') {
            const until = new Date(agentAccessUntil);
            if (isNaN(until) || until <= new Date()) {
                return res.redirect(`/users/${shownUser._id}?error=Pick an end date in the future`);
            }
            shownUser.agentAccessUntil = until;
        } else {
            shownUser.agentAccessUntil = undefined;
        }
        shownUser.agentAccess = ['temporary', 'permanent'].includes(agentAccess) ? agentAccess : 'none';
        await shownUser.save();
        res.redirect(`/users/${shownUser._id}?saved=1`);
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const updatePassword = async (req, res) => {
    try {
        const shownUser = await findUser(req);
        if (!shownUser) return res.status(404).render('error.ejs', { message: 'User not found' });
        const back = (error) => res.redirect(`/users/${shownUser._id}?error=${encodeURIComponent(error)}`);
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (isMe(req) && !(await bcrypt.compare(String(currentPassword || ''), shownUser.password))) {
            return back('Current password is wrong');
        }
        if (String(newPassword || '').length < 6) return back('Password must be at least 6 characters');
        if (newPassword !== confirmPassword) return back('Passwords do not match');

        shownUser.password = await bcrypt.hash(newPassword, 10);
        await shownUser.save();
        res.redirect(`/users/${shownUser._id}?saved=1`);
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

const remove = async (req, res) => {
    try {
        const shownUser = await findUser(req);
        if (!shownUser) return res.status(404).render('error.ejs', { message: 'User not found' });
        if (isMe(req) && (isStaff(shownUser) || isSuperOwner(shownUser))) {
            return res.redirect(`/users/${shownUser._id}?error=You can not delete your own ${shownUser.role} account`);
        }
        const owner = await Owner.findOne({ user: shownUser._id });
        if (owner) {
            const cars = await Car.find({ owner: owner._id });
            await CodeLog.deleteMany({ car: { $in: cars.map((c) => c._id) } });
            await Car.deleteMany({ owner: owner._id });
            await owner.deleteOne();
        }
        await CodeLog.deleteMany({ user: shownUser._id });
        await shownUser.deleteOne();

        if (isMe(req)) return req.session.destroy(() => res.redirect('/'));
        res.redirect('/users');
    } catch (error) {
        console.log(error);
        res.status(500).render('error.ejs', { message: 'Something went wrong' });
    }
};

module.exports = { index, newUser, create, show, update, updateAgentAccess, updatePassword, remove };
