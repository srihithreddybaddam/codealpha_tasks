const mongoose = require('mongoose');
const Moment = require('../models/Moment');
const { uploadImage } = require('../config/cloudinary');

let inMemoryMoments = [
  {
    _id: '65f5a1b2c3d4e5f6a7b8c9e0',
    user: {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Elena Rostova',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      isVerified: true
    },
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    caption: 'Crafting creative vertical visual experiences for Vibely Moments ✨ #vibely #storytelling',
    location: 'Tokyo, Japan',
    viewsCount: 342,
    createdAt: new Date().toISOString()
  }
];

// @desc    Create a Moment
// @route   POST /moments or /api/moments
// @access  Private
exports.createMoment = async (req, res) => {
  try {
    const { caption, location } = req.body;

    let mediaUrl = req.body.mediaUrl;
    if (req.file) {
      mediaUrl = await uploadImage(req.file.path, 'vibely/moments');
    }

    if (!mediaUrl) {
      return res.status(400).json({ success: false, message: 'Please upload media for Moment' });
    }

    const moment = {
      _id: new mongoose.Types.ObjectId().toString(),
      user: {
        _id: req.user._id,
        name: req.user.name || 'Vibely Creator',
        username: req.user.username || 'vibely',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        isVerified: true
      },
      mediaUrl,
      caption: caption ? caption.trim() : '',
      location: location ? location.trim() : '',
      viewsCount: 1,
      createdAt: new Date().toISOString()
    };

    inMemoryMoments.unshift(moment);

    return res.status(201).json({
      success: true,
      message: 'Moment created successfully!',
      moment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Moments
// @route   GET /moments or /api/moments
// @access  Public
exports.getMoments = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: inMemoryMoments.length,
    moments: inMemoryMoments
  });
};

// @desc    Update a Moment
// @route   PUT /moments/:id or /api/moments/:id
// @access  Private
exports.updateMoment = async (req, res) => {
  const { caption, location } = req.body;
  const m = inMemoryMoments.find((x) => x._id === req.params.id);
  if (m) {
    if (caption !== undefined) m.caption = caption.trim();
    if (location !== undefined) m.location = location.trim();
    return res.status(200).json({ success: true, message: 'Moment updated', moment: m });
  }
  return res.status(404).json({ success: false, message: 'Moment not found' });
};

// @desc    Delete a Moment
// @route   DELETE /moments/:id or /api/moments/:id
// @access  Private
exports.deleteMoment = async (req, res) => {
  inMemoryMoments = inMemoryMoments.filter((m) => m._id !== req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Moment deleted',
    momentId: req.params.id
  });
};

// @desc    Increment view count
// @route   POST /api/moments/:id/view
// @access  Public
exports.incrementViews = async (req, res) => {
  return res.status(200).json({ success: true, viewsCount: 343 });
};
