const express = require('express');
const router = express.Router();
const {
  updateSettings,
  changePassword,
  getSessions,
  deleteSessions,
  blockUser,
  unblockUser,
  getBlockedUsers,
  muteUser,
  unmuteUser,
  getMutedUsers,
  submitReport,
  deleteAccount
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.put('/settings', protect, updateSettings);
router.put('/password', protect, changePassword);
router.get('/sessions', protect, getSessions);
router.delete('/sessions', protect, deleteSessions);

router.post('/block', protect, blockUser);
router.delete('/block', protect, unblockUser);
router.get('/block', protect, getBlockedUsers);

router.post('/mute', protect, muteUser);
router.delete('/mute', protect, unmuteUser);
router.get('/mute', protect, getMutedUsers);

router.post('/report', protect, submitReport);
router.delete('/account', protect, deleteAccount);

module.exports = router;
