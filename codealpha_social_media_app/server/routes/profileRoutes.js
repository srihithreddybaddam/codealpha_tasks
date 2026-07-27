const express = require('express');
const router = express.Router();
const {
  getProfile,
  getProfileByUsername,
  updateProfile,
  uploadProfilePicture,
  uploadCoverImage
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Profile Endpoints
router.get('/', protect, getProfile);
router.get('/:username', getProfileByUsername);
router.put('/', protect, updateProfile);

// Media Upload Endpoints
router.post('/upload/profile-picture', protect, upload.single('avatar'), uploadProfilePicture);
router.post('/upload/cover-image', protect, upload.single('coverImage'), uploadCoverImage);

module.exports = router;
