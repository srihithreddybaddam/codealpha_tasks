const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/notifications', protect, getNotifications);
router.put('/notifications/read', protect, markAsRead);
router.put('/notifications/:id/read', protect, markAsRead);
router.put('/notifications/read-all', protect, markAllRead);
router.delete('/notifications/:id', protect, deleteNotification);

module.exports = router;
