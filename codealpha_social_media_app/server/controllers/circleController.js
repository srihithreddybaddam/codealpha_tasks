const Circle = require('../models/Circle');
const User = require('../models/User');

// @desc    Get current user's Private Circle
// @route   GET /circle or /api/circle
// @access  Private
exports.getCircle = async (req, res) => {
  try {
    let circle = await Circle.findOne({ user: req.user._id }).populate(
      'members',
      'name username avatar bio isVerified'
    );

    if (!circle) {
      circle = await Circle.create({ user: req.user._id, members: [] });
    }

    return res.status(200).json({
      success: true,
      count: circle.members.length,
      members: circle.members
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Private Circle members list
// @route   PUT /circle or /api/circle or POST /circle
// @access  Private
exports.updateCircle = async (req, res) => {
  try {
    const { members } = req.body; // Array of user IDs
    if (!Array.isArray(members)) {
      return res.status(400).json({ success: false, message: 'Members must be an array of user IDs' });
    }

    let circle = await Circle.findOne({ user: req.user._id });
    if (!circle) {
      circle = new Circle({ user: req.user._id, members });
    } else {
      circle.members = members;
    }

    await circle.save();
    const populated = await circle.populate('members', 'name username avatar bio isVerified');

    return res.status(200).json({
      success: true,
      message: 'Private Circle updated!',
      members: populated.members
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
