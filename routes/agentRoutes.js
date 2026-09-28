const express = require('express');
const router = express.Router();
const agent = require('../controllers/agentController');
const isAdmin = require('../middleware/isAdmin');

// Mounted at /agent and requires a signed-in user

// ----- User -----

// Ask page
router.get('/', agent.index);

// Send a question and get an answer
router.post('/ask', agent.ask);

// Send a correction for the admin to review
router.post('/feedback', agent.sendFeedback);

// ----- Admin only -----

// Control page
router.get('/admin', isAdmin, agent.admin);

// Update name, status and instructions
router.put('/admin', isAdmin, agent.updateAgent);

// Add / delete knowledge
router.post('/admin/knowledge', isAdmin, agent.addKnowledge);
router.delete('/admin/knowledge/:kid', isAdmin, agent.deleteKnowledge);

// Approve / reject a user correction
router.put('/admin/feedback/:fid', isAdmin, agent.approveFeedback);
router.delete('/admin/feedback/:fid', isAdmin, agent.rejectFeedback);

module.exports = router;
