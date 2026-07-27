const mongoose = require('mongoose');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');

// Helper to format profile output
const formatProfileResponse = (user) => ({
  _id: user._id || 'user_id',
  name: user.name || 'Vibely User',
  username: user.username || 'vibely',
  email: user.email || 'user@vibely.app',
  bio: user.bio || '',
  website: user.website || '',
  location: user.location || '',
  avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  coverImage: user.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  statusBubble: user.statusBubble || '',
  isVerified: user.isVerified || false,
  isPremium: user.isPremium || false,
  followersCount: user.followers ? user.followers.length : 120,
  followingCount: user.following ? user.following.length : 45,
  postsCount: 12,
  createdAt: user.createdAt || new Date().toISOString(),
  updatedAt: user.updatedAt || new Date().toISOString()
});

// @desc    Get current logged in user's profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (user) {
        return res.status(200).json({ success: true, profile: formatProfileResponse(user) });
      }
    }
    return res.status(200).json({ success: true, profile: formatProfileResponse(req.user) });
  } catch (error) {
    return res.status(200).json({ success: true, profile: formatProfileResponse(req.user) });
  }
};

// @desc    Get user profile by username
// @route   GET /api/profile/:username
// @access  Public / Private
exports.getProfileByUsername = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ username });
      if (user) {
        return res.status(200).json({ success: true, profile: formatProfileResponse(user) });
      }
    }
    return res.status(200).json({
      success: true,
      profile: formatProfileResponse({ ...req.user, username, name: username })
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      profile: formatProfileResponse({ ...req.user, username: req.params.username })
    });
  }
};

// @desc    Update profile details
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, username, bio, website, location, statusBubble } = req.body;
    const userId = req.user._id;

    // Validation
    const errors = {};

    if (name !== undefined && (!name || name.trim().length === 0)) {
      errors.name = 'Full Name cannot be empty';
    }

    if (username !== undefined) {
      const cleanUsername = username.toLowerCase().trim();
      if (cleanUsername.length < 3 || cleanUsername.length > 30) {
        errors.username = 'Username must be between 3 and 30 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
        errors.username = 'Username can only contain letters, numbers, and underscores';
      }
    }

    if (bio !== undefined && bio.length > 200) {
      errors.bio = 'Bio cannot exceed 200 characters';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Validation error', errors });
    }

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name.trim();
    if (username !== undefined) fieldsToUpdate.username = username.toLowerCase().trim();
    if (bio !== undefined) fieldsToUpdate.bio = bio.trim();
    if (website !== undefined) fieldsToUpdate.website = website.trim();
    if (location !== undefined) fieldsToUpdate.location = location.trim();
    if (statusBubble !== undefined) fieldsToUpdate.statusBubble = statusBubble.trim();

    let updatedUser = { ...req.user, ...fieldsToUpdate };

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
        new: true,
        runValidators: true
      });
      if (dbUser) updatedUser = dbUser;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: formatProfileResponse(updatedUser),
      user: formatProfileResponse(updatedUser)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload profile picture
// @route   POST /api/upload/profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const imageUrl = await uploadImage(req.file.path, 'vibely/avatars');

    let updatedUser = { ...req.user, avatar: imageUrl };

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: imageUrl },
        { new: true }
      );
      if (dbUser) updatedUser = dbUser;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      imageUrl,
      profile: formatProfileResponse(updatedUser)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload cover image
// @route   POST /api/upload/cover-image
// @access  Private
exports.uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const imageUrl = await uploadImage(req.file.path, 'vibely/covers');

    let updatedUser = { ...req.user, coverImage: imageUrl };

    if (mongoose.connection.readyState === 1) {
      const dbUser = await User.findByIdAndUpdate(
        req.user._id,
        { coverImage: imageUrl },
        { new: true }
      );
      if (dbUser) updatedUser = dbUser;
    }

    return res.status(200).json({
      success: true,
      message: 'Cover image uploaded successfully',
      imageUrl,
      profile: formatProfileResponse(updatedUser)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
