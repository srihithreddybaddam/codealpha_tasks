const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
