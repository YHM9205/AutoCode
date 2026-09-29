const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const isAdmin = require('../middleware/isAdmin');
const isSuperOwner = require('../middleware/isSuperOwner');

router.get('/', isAdmin, users.index);

router.get('/new', isSuperOwner, users.newUser);

router.post('/', isSuperOwner, users.create);

router.get('/:id', users.show);

router.put('/:id', users.update);

router.put('/:id/agent-access', users.updateAgentAccess);

router.put('/:id/password', users.updatePassword);

router.delete('/:id', users.remove);

module.exports = router;
