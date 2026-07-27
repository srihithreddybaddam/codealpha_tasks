const User = require('../models/User');

// Helper to format user list for followers/following modals
const formatUserItem = (user, currentUserId) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  avatar: user.avatar,
  bio: user.bio || '',
  isVerified: user.isVerified || false,
  isFollowing: user.followers ? user.followers.some((id) => id.toString() === currentUserId.toString()) : false
});

// @desc    Follow user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    const isFollowing = currentUser.following.some((id) => id.toString() === targetUserId.toString());

    if (!isFollowing) {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
      await currentUser.save();
      await targetUser.save();
    }

    return res.status(200).json({
      success: true,
      message: `You are now following @${targetUser.username}`,
      isFollowing: true,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found' });
    }

    currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUserId.toString());
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId.toString());

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `Unfollowed @${targetUser.username}`,
      isFollowing: false,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user followers
// @route   GET /api/users/:userId/followers or GET /api/followers/:userId
// @access  Public / Private
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('followers', 'name username avatar bio isVerified followers');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentUserId = req.user ? req.user._id : '';
    const followers = user.followers.map((u) => formatUserItem(u, currentUserId));

    return res.status(200).json({
      success: true,
      count: followers.length,
      followers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user following
// @route   GET /api/users/:userId/following or GET /api/following/:userId
// @access  Public / Private
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('following', 'name username avatar bio isVerified followers');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentUserId = req.user ? req.user._id : '';
    const following = user.following.map((u) => formatUserItem(u, currentUserId));

    return res.status(200).json({
      success: true,
      count: following.length,
      following
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
