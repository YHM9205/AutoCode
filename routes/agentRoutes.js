const express = require('express');
const router = express.Router();
const agent = require('../controllers/agentController');
const canControlAgent = require('../middleware/canControlAgent');

// Mounted at /agent and requires a signed-in user

// ----- User -----

// Ask page
router.get('/', agent.index);

// Send a question and get an answer
router.post('/ask', agent.ask);

// Start a new conversation
router.post('/new', agent.newChat);

// Send a correction for the admin to review
router.post('/feedback', agent.sendFeedback);

// ----- Agent Control: super owner, or staff given access -----

// Control page
router.get('/admin', canControlAgent, agent.admin);

// Update name, status and instructions
router.put('/admin', canControlAgent, agent.updateAgent);

// Add / delete knowledge
router.post('/admin/knowledge', canControlAgent, agent.addKnowledge);
router.delete('/admin/knowledge/:kid', canControlAgent, agent.deleteKnowledge);

// Add a code that users logged but is not in the database
router.post('/admin/codes', canControlAgent, agent.addCode);

// Approve / reject a user correction
router.put('/admin/feedback/:fid', canControlAgent, agent.approveFeedback);
router.delete('/admin/feedback/:fid', canControlAgent, agent.rejectFeedback);

module.exports = router;
