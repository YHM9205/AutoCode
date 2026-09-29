const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const isAdmin = require('../middleware/isAdmin');
const isSuperOwner = require('../middleware/isSuperOwner');

// Mounted at /users and requires a signed-in user
// A user manages their own profile, an admin manages normal users, the super owner manages everyone

// Index (admin / super owner): list users, search by id with ?id=
router.get('/', isAdmin, users.index);

// New: the add user form (super owner only, above /:id so "new" is not read as an id)
router.get('/new', isSuperOwner, users.newUser);

// Create: add a user (super owner only)
router.post('/', isSuperOwner, users.create);

// Show: one user (cars and logs only on your own profile)
router.get('/:id', users.show);

// Update: username, email (and role, super owner only)
router.put('/:id', users.update);

// Update Agent Control access (super owner only)
router.put('/:id/agent-access', users.updateAgentAccess);

// Update password: your own, or anyone's you manage (for a forgotten password)
router.put('/:id/password', users.updatePassword);

// Delete: remove the user and everything they own
router.delete('/:id', users.remove);

module.exports = router;
