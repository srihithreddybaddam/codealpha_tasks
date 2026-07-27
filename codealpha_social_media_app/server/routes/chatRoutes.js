const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage, getConversations } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/messages', protect, upload.single('media'), sendMessage);
router.get('/messages/:userId', protect, getMessages);
router.delete('/messages/:id', protect, deleteMessage);
router.get('/conversations', protect, getConversations);

module.exports = router;
