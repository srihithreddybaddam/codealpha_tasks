const inMemoryNotifications = [
  {
    id: 'notif-1',
    type: 'assignment',
    title: 'Task Assigned',
    message: 'Sarah Chen assigned you to "Architect Glassmorphism Specular Reflection System"',
    linkTaskId: 'tsk-101',
    read: false,
    createdAt: '10 min ago'
  },
  {
    id: 'notif-2',
    type: 'mention',
    title: 'New Mention in Comment',
    message: 'Alex Rivera mentioned you in "Web Audio Synthesizer Micro-Interactions"',
    linkTaskId: 'tsk-102',
    read: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'notif-3',
    type: 'due',
    title: 'Deadline Approaching',
    message: '"Cmd + K Floating Glass Command Palette" is due tomorrow',
    linkTaskId: 'tsk-103',
    read: true,
    createdAt: '3 hours ago'
  }
];

// @desc Get user notifications
// @route GET /api/notifications
const getNotifications = async (req, res) => {
  return res.json({ success: true, count: inMemoryNotifications.length, notifications: inMemoryNotifications });
};

// @desc Mark notification read
// @route POST /api/notifications/:id/read
const markRead = async (req, res) => {
  const notif = inMemoryNotifications.find((n) => n.id === req.params.id);
  if (notif) {
    notif.read = true;
  }
  return res.json({ success: true });
};

// @desc Clear all notifications
// @route DELETE /api/notifications
const clearAll = async (req, res) => {
  inMemoryNotifications.length = 0;
  return res.json({ success: true, message: 'All notifications cleared' });
};

module.exports = {
  getNotifications,
  markRead,
  clearAll
};
