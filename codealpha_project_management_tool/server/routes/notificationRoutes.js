const express = require('express');
const router = express.Router();
const { getNotifications, markRead, clearAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getNotifications);
router.post('/:id/read', protect, markRead);
router.delete('/', protect, clearAll);

module.exports = router;
