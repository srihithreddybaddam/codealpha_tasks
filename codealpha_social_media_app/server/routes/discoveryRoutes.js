const express = require('express');
const router = express.Router();
const {
  search,
  searchUsers,
  searchPosts,
  searchHashtags,
  getPostsByHashtag,
  getExplore,
  getTrending,
  getSuggestedUsers
} = require('../controllers/discoveryController');

// Search Routes
router.get('/search', search);
router.get('/search/users', searchUsers);
router.get('/search/posts', searchPosts);
router.get('/search/hashtags', searchHashtags);

// Hashtags & Discovery Routes
router.get('/hashtags/:name', getPostsByHashtag);
router.get('/explore', getExplore);
router.get('/trending', getTrending);
router.get('/suggested-users', getSuggestedUsers);

module.exports = router;
