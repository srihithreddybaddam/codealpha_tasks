const Memory = require('../models/Memory');

// @desc    Get user's pinned Memory Wall
// @route   GET /memory or /api/memory/:userId
// @access  Public / Private
exports.getMemories = async (req, res) => {
  try {
    const targetUserId = req.params.userId || req.user._id;

    const memories = await Memory.find({ user: targetUserId })
      .populate({
        path: 'post',
        populate: { path: 'user', select: 'name username avatar isVerified' }
      })
      .populate({
        path: 'moment',
        populate: { path: 'user', select: 'name username avatar isVerified' }
      })
      .sort({ pinnedAt: -1 });

    return res.status(200).json({
      success: true,
      count: memories.length,
      memories
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Pin a post or moment to Memory Wall
// @route   POST /memory or /api/memory
// @access  Private
exports.pinMemory = async (req, res) => {
  try {
    const { postId, momentId } = req.body;
    if (!postId && !momentId) {
      return res.status(400).json({ success: false, message: 'Must provide either postId or momentId' });
    }

    const memory = await Memory.create({
      user: req.user._id,
      post: postId || null,
      moment: momentId || null
    });

    const populated = await memory.populate(['post', 'moment']);

    return res.status(201).json({
      success: true,
      message: 'Pinned to Memory Wall!',
      memory: populated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unpin from Memory Wall
// @route   DELETE /memory/:id or /api/memory/:id
// @access  Private
exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory pin not found' });
    }

    if (memory.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to remove this memory pin' });
    }

    await Memory.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Removed from Memory Wall',
      memoryId: req.params.id
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
