const User = require('../models/User');

// @desc    Update Status Bubble (max 80 chars)
// @route   PUT /status or /api/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const { statusBubble } = req.body;
    if (statusBubble && statusBubble.length > 80) {
      return res.status(400).json({ success: false, message: 'Status Bubble cannot exceed 80 characters' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { statusBubble: statusBubble ? statusBubble.trim() : '' },
      { new: true }
    ).select('name username avatar statusBubble');

    return res.status(200).json({
      success: true,
      message: 'Status Bubble updated!',
      statusBubble: user.statusBubble
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user Status Bubble
// @route   GET /status or /api/status
// @access  Public / Private
exports.getStatus = async (req, res) => {
  try {
    const userId = req.query.userId || (req.user ? req.user._id : null);
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const user = await User.findById(userId).select('name username avatar statusBubble');
    return res.status(200).json({
      success: true,
      statusBubble: user ? user.statusBubble || '' : ''
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
