const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Post Endpoints
router.post('/', protect, upload.single('image'), createPost);
router.get('/', getPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
