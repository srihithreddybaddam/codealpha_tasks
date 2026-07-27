const express = require('express');
const router = express.Router();
const { getMembers, inviteMember, updateMemberRole, removeMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.get('/members', getMembers);
router.post('/invite', protect, inviteMember);
router.post('/role', protect, updateMemberRole);
router.delete('/member/:id', protect, removeMember);

module.exports = router;
