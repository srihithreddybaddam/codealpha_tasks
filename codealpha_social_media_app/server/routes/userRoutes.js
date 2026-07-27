const express = require('express');
const router = express.Router();
const { getUserProfile, followUser, search, getMoments } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/profile/:username', getUserProfile);
router.put('/:id/follow', protect, followUser);
router.get('/search', search);
router.get('/moments', getMoments);

module.exports = router;
