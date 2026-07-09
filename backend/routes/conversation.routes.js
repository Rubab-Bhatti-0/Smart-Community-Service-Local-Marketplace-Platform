
const express = require('express');
const router = express.Router();
const { authorizaton } = require('../middleware/auth.middleware');
const { startConversation, getMyConversations, getMessages } = require('../controller/conversation.controller');

router.post('/', authorizaton, startConversation);
router.get('/', authorizaton, getMyConversations);
router.get('/:id/messages', authorizaton, getMessages);

module.exports = router;