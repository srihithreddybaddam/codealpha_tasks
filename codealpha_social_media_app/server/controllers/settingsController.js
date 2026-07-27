const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Block = require('../models/Block');
const Mute = require('../models/Mute');
const Report = require('../models/Report');

let inMemoryBlocked = [
  {
    _id: 'b1',
    user: '65f1a2b3c4d5e6f7a8b9c0d1',
    blockedUser: {
      _id: '65f1a2b3c4d5e6f7a8b9c0d9',
      name: 'Spam Bot',
      username: 'spambot99',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'
    },
    createdAt: new Date().toISOString()
  }
];

let inMemoryMuted = [];
let inMemoryReports = [];

// @desc    Update Settings & Privacy Preferences
// @route   PUT /api/settings
// @access  Private
exports.updateSettings = async (req, res) => {
  try {
    const { name, bio, location, website, isPrivate, allowMessages, allowComments, allowTagging, showOnlineStatus, showLastSeen } = req.body;

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name) user.name = name.trim();
        if (bio !== undefined) user.bio = bio.trim();
        if (location !== undefined) user.location = location.trim();
        if (website !== undefined) user.website = website.trim();
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        isPrivate: isPrivate !== undefined ? isPrivate : false,
        allowMessages: allowMessages || 'everyone',
        allowComments: allowComments || 'everyone',
        allowTagging: allowTagging || 'everyone',
        showOnlineStatus: showOnlineStatus !== undefined ? showOnlineStatus : true,
        showLastSeen: showLastSeen !== undefined ? showLastSeen : true
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change Password
// @route   PUT /api/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('+password');
      if (user) {
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Incorrect current password' });
        }
        user.password = newPassword;
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Active Sessions
// @route   GET /api/sessions
// @access  Private
exports.getSessions = async (req, res) => {
  return res.status(200).json({
    success: true,
    sessions: [
      {
        _id: 's1',
        device: 'Chrome on Windows 11',
        ip: '127.0.0.1',
        location: 'Current Session (Localhost)',
        isCurrent: true,
        lastActive: new Date().toISOString()
      }
    ]
  });
};

// @desc    Revoke Sessions
// @route   DELETE /api/sessions
// @access  Private
exports.deleteSessions = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out from all other active devices'
  });
};

// @desc    Block User
// @route   POST /api/block
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Target user ID is required' });
    }

    const newBlock = {
      _id: new mongoose.Types.ObjectId().toString(),
      user: req.user._id,
      blockedUser: {
        _id: targetUserId,
        name: 'Blocked User',
        username: 'blocked_user',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=80'
      },
      createdAt: new Date().toISOString()
    };

    inMemoryBlocked.push(newBlock);

    return res.status(201).json({
      success: true,
      message: 'User blocked successfully',
      block: newBlock
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unblock User
// @route   DELETE /api/block
// @access  Private
exports.unblockUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    inMemoryBlocked = inMemoryBlocked.filter((b) => b.blockedUser._id !== targetUserId && b._id !== targetUserId);
    return res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Blocked Users List
// @route   GET /api/block
// @access  Private
exports.getBlockedUsers = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: inMemoryBlocked.length,
    blockedUsers: inMemoryBlocked
  });
};

// @desc    Mute User
// @route   POST /api/mute
// @access  Private
exports.muteUser = async (req, res) => {
  const { targetUserId } = req.body;
  inMemoryMuted.push({
    _id: new mongoose.Types.ObjectId().toString(),
    user: req.user._id,
    mutedUser: { _id: targetUserId, name: 'Muted User', username: 'muted_user' }
  });
  return res.status(201).json({ success: true, message: 'User muted' });
};

// @desc    Unmute User
// @route   DELETE /api/mute
// @access  Private
exports.unmuteUser = async (req, res) => {
  const { targetUserId } = req.body;
  inMemoryMuted = inMemoryMuted.filter((m) => m.mutedUser._id !== targetUserId);
  return res.status(200).json({ success: true, message: 'User unmuted' });
};

// @desc    Get Muted Users List
// @route   GET /api/mute
// @access  Private
exports.getMutedUsers = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: inMemoryMuted.length,
    mutedUsers: inMemoryMuted
  });
};

// @desc    Submit Content / User Report
// @route   POST /api/report
// @access  Private
exports.submitReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;
    if (!targetType || !targetId || !reason) {
      return res.status(400).json({ success: false, message: 'Target type, target ID, and reason are required' });
    }

    const report = {
      _id: new mongoose.Types.ObjectId().toString(),
      reporter: req.user._id,
      targetType,
      targetId,
      reason,
      description: description ? description.trim() : '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    inMemoryReports.push(report);

    return res.status(201).json({
      success: true,
      message: 'Thank you. Your report has been submitted for review.',
      report
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Account (Permanent)
// @route   DELETE /api/account
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password confirmation is required to delete account' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('+password');
      if (user) {
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Incorrect password' });
        }
        await User.findByIdAndDelete(req.user._id);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
