const express = require('express');
const router = express.Router();
const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
} = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

// Follow & Unfollow Endpoints
router.post('/users/:id/follow', protect, followUser);
router.delete('/users/:id/follow', protect, unfollowUser);

// Followers & Following Lists Endpoints
router.get('/users/:userId/followers', getFollowers);
router.get('/users/:userId/following', getFollowing);
router.get('/followers/:userId', getFollowers);
router.get('/following/:userId', getFollowing);

module.exports = router;
