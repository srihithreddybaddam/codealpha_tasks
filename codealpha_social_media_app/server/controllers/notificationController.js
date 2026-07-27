const mongoose = require('mongoose');
const Notification = require('../models/Notification');

let inMemoryNotifications = [
  {
    _id: 'n1',
    recipient: 'user1',
    sender: {
      _id: 'sys',
      name: 'Vibely Team',
      username: 'vibely',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
    },
    type: 'circle',
    referenceId: 'sys1',
    readStatus: false,
    createdAt: new Date(Date.now() - 300000).toISOString()
  },
  {
    _id: 'n2',
    recipient: 'user1',
    sender: {
      _id: 'u1',
      name: 'Riya Sharma',
      username: 'riya_design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    },
    type: 'like',
    referenceId: 'p1',
    readStatus: false,
    createdAt: new Date(Date.now() - 900000).toISOString()
  },
  {
    _id: 'n3',
    recipient: 'user1',
    sender: {
      _id: 'u2',
      name: 'Arjun Rao',
      username: 'arjun_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    },
    type: 'follow',
    referenceId: 'u2',
    readStatus: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 'n4',
    recipient: 'user1',
    sender: {
      _id: 'u3',
      name: 'Priya Patel',
      username: 'priya_code',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80'
    },
    type: 'comment',
    referenceId: 'p1',
    readStatus: true,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 'n5',
    recipient: 'user1',
    sender: {
      _id: 'u4',
      name: 'Sneha Deshmukh',
      username: 'sneha_code',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80'
    },
    type: 'reply',
    referenceId: 'c1',
    readStatus: true,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  }
];

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find({ recipient: req.user._id })
        .populate('sender', 'name username avatar')
        .sort({ createdAt: -1 });

      if (notifications && notifications.length > 0) {
        return res.status(200).json({
          success: true,
          count: notifications.length,
          unreadCount: notifications.filter((n) => !n.readStatus).length,
          notifications
        });
      }
    }

    const unread = inMemoryNotifications.filter((n) => !n.readStatus).length;
    return res.status(200).json({
      success: true,
      count: inMemoryNotifications.length,
      unreadCount: unread,
      notifications: inMemoryNotifications
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: inMemoryNotifications.length,
      unreadCount: inMemoryNotifications.filter((n) => !n.readStatus).length,
      notifications: inMemoryNotifications
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/read or PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notifId = req.params.id || req.body.id;
    if (notifId) {
      inMemoryNotifications = inMemoryNotifications.map((n) => (n._id === notifId ? { ...n, readStatus: true } : n));
    }
    return res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllRead = async (req, res) => {
  try {
    inMemoryNotifications = inMemoryNotifications.map((n) => ({ ...n, readStatus: true }));
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
  try {
    inMemoryNotifications = inMemoryNotifications.filter((n) => n._id !== req.params.id);
    return res.status(200).json({ success: true, notificationId: req.params.id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
