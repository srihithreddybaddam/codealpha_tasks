const express = require('express');
const router = express.Router();
const {
  likePost,
  unlikePost,
  addComment,
  getPostComments,
  replyToComment,
  editComment,
  deleteComment,
  bookmarkPost,
  unbookmarkPost,
  getBookmarks
} = require('../controllers/interactionController');
const { protect } = require('../middleware/authMiddleware');

// Like Endpoints
router.post('/posts/:id/like', protect, likePost);
router.delete('/posts/:id/like', protect, unlikePost);

// Comment Endpoints
router.post('/posts/:id/comment', protect, addComment);
router.get('/posts/:id/comments', getPostComments);
router.post('/comments/:id/reply', protect, replyToComment);
router.put('/comments/:id', protect, editComment);
router.delete('/comments/:id', protect, deleteComment);

// Bookmark Endpoints
router.post('/posts/:id/bookmark', protect, bookmarkPost);
router.delete('/posts/:id/bookmark', protect, unbookmarkPost);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
