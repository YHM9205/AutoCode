const express = require('express');
const router = express.Router();
const agent = require('../controllers/agentController');
const canControlAgent = require('../middleware/canControlAgent');

router.get('/', agent.index);

router.post('/ask', agent.ask);

router.post('/new', agent.newChat);

router.post('/feedback', agent.sendFeedback);

router.get('/admin', canControlAgent, agent.admin);

router.put('/admin', canControlAgent, agent.updateAgent);

router.post('/admin/knowledge', canControlAgent, agent.addKnowledge);
router.delete('/admin/knowledge/:kid', canControlAgent, agent.deleteKnowledge);

router.post('/admin/codes', canControlAgent, agent.addCode);

router.put('/admin/feedback/:fid', canControlAgent, agent.approveFeedback);
router.delete('/admin/feedback/:fid', canControlAgent, agent.rejectFeedback);

module.exports = router;
