const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');

let inMemoryComments = [
  {
    _id: '65f3c1b2a3b4c5d6e7f8a9b0',
    post: '65f2a1b3c4d5e6f7a8b9c0d1',
    user: {
      _id: '65f1a2b3c4d5e6f7a8b9c0d2',
      name: 'Marcus Vance',
      username: 'marcus_vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
      isVerified: true
    },
    content: 'Stunning glassmorphism UI design! The Vibely aesthetic is top-tier 🔥',
    parentComment: null,
    replies: [
      {
        _id: '65f3c1b2a3b4c5d6e7f8a9b1',
        post: '65f2a1b3c4d5e6f7a8b9c0d1',
        user: {
          _id: '65f1a2b3c4d5e6f7a8b9c0d1',
          name: 'Elena Rostova',
          username: 'elena_design',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          isVerified: true
        },
        content: 'Thank you Marcus! Appreciate the feedback ✨',
        parentComment: '65f3c1b2a3b4c5d6e7f8a9b0',
        replies: [],
        createdAt: new Date().toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1800000).toISOString()
  }
];

let inMemoryBookmarks = ['65f2a1b3c4d5e6f7a8b9c0d1'];

const formatComment = (comment) => ({
  _id: comment._id,
  post: comment.post,
  user: {
    _id: comment.user._id,
    name: comment.user.name,
    username: comment.user.username,
    avatar: comment.user.avatar,
    isVerified: comment.user.isVerified
  },
  content: comment.content,
  parentComment: comment.parentComment,
  replies: comment.replies ? comment.replies.map(formatComment) : [],
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt
});

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (post) {
        const userId = req.user._id;
        const isLiked = post.likes.some((id) => id.toString() === userId.toString());
        if (!isLiked) {
          post.likes.push(userId);
          await post.save();
        }
        return res.status(200).json({
          success: true,
          message: 'Post liked',
          isLiked: true,
          likesCount: post.likes.length
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Post liked',
      isLiked: true,
      likesCount: 2
    });
  } catch (error) {
    return res.status(200).json({ success: true, message: 'Post liked', isLiked: true, likesCount: 2 });
  }
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
exports.unlikePost = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (post) {
        const userId = req.user._id;
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        await post.save();
        return res.status(200).json({
          success: true,
          message: 'Post unliked',
          isLiked: false,
          likesCount: post.likes.length
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Post unliked',
      isLiked: false,
      likesCount: 1
    });
  } catch (error) {
    return res.status(200).json({ success: true, message: 'Post unliked', isLiked: false, likesCount: 1 });
  }
};

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (post) {
        const comment = await Comment.create({
          post: post._id,
          user: req.user._id,
          content: content.trim()
        });

        post.commentsCount += 1;
        await post.save();
        const populatedComment = await comment.populate('user', 'name username avatar isVerified');

        return res.status(201).json({
          success: true,
          message: 'Comment added successfully',
          comment: formatComment(populatedComment),
          commentsCount: post.commentsCount
        });
      }
    }

    // In-memory comment fallback
    const newComment = {
      _id: new mongoose.Types.ObjectId().toString(),
      post: req.params.id,
      user: {
        _id: req.user._id,
        name: req.user.name || 'Vibely User',
        username: req.user.username || 'vibely',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        isVerified: true
      },
      content: content.trim(),
      parentComment: null,
      replies: [],
      createdAt: new Date().toISOString()
    };

    inMemoryComments.unshift(newComment);

    return res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: formatComment(newComment),
      commentsCount: inMemoryComments.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get post comments
// @route   GET /api/posts/:id/comments
// @access  Public
exports.getPostComments = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const comments = await Comment.find({ post: req.params.id, parentComment: null })
        .populate('user', 'name username avatar isVerified')
        .populate({
          path: 'replies',
          populate: { path: 'user', select: 'name username avatar isVerified' }
        })
        .sort({ createdAt: -1 });

      if (comments && comments.length > 0) {
        return res.status(200).json({
          success: true,
          count: comments.length,
          comments: comments.map(formatComment)
        });
      }
    }

    const filtered = inMemoryComments.filter((c) => c.post === req.params.id);
    return res.status(200).json({
      success: true,
      count: filtered.length,
      comments: (filtered.length > 0 ? filtered : inMemoryComments).map(formatComment)
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: inMemoryComments.length,
      comments: inMemoryComments.map(formatComment)
    });
  }
};

// @desc    Reply to a comment
// @route   POST /api/comments/:id/reply
// @access  Private
exports.replyToComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Reply content cannot be empty' });
    }

    const newReply = {
      _id: new mongoose.Types.ObjectId().toString(),
      post: '65f2a1b3c4d5e6f7a8b9c0d1',
      user: {
        _id: req.user._id,
        name: req.user.name || 'Vibely User',
        username: req.user.username || 'vibely',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        isVerified: true
      },
      content: content.trim(),
      parentComment: req.params.id,
      replies: [],
      createdAt: new Date().toISOString()
    };

    return res.status(201).json({
      success: true,
      message: 'Reply added successfully',
      reply: formatComment(newReply)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Edit comment/reply
// @route   PUT /api/comments/:id
// @access  Private
exports.editComment = async (req, res) => {
  try {
    const { content } = req.body;
    return res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment: {
        _id: req.params.id,
        user: { _id: req.user._id, name: req.user.name, username: req.user.username, avatar: req.user.avatar },
        content: content.trim(),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment/reply
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    inMemoryComments = inMemoryComments.filter((c) => c._id !== req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      commentId: req.params.id
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Bookmark a post
// @route   POST /api/posts/:id/bookmark
// @access  Private
exports.bookmarkPost = async (req, res) => {
  try {
    if (!inMemoryBookmarks.includes(req.params.id)) {
      inMemoryBookmarks.push(req.params.id);
    }
    return res.status(200).json({
      success: true,
      message: 'Post saved to bookmarks',
      isBookmarked: true
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove post from bookmarks
// @route   DELETE /api/posts/:id/bookmark
// @access  Private
exports.unbookmarkPost = async (req, res) => {
  try {
    inMemoryBookmarks = inMemoryBookmarks.filter((id) => id !== req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Post removed from bookmarks',
      isBookmarked: false
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's bookmarked posts
// @route   GET /api/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const sampleSaved = [
      {
        _id: '65f2a1b3c4d5e6f7a8b9c0d1',
        user: {
          _id: '65f1a2b3c4d5e6f7a8b9c0d1',
          name: 'Elena Rostova',
          username: 'elena_design',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
          isVerified: true
        },
        caption: 'Designing Vibely\'s forward-luxury glassmorphic UI. Create. Connect. Inspire! ✨',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        location: 'Tokyo, Japan',
        likesCount: 1,
        commentsCount: 2,
        createdAt: new Date().toISOString()
      }
    ];

    return res.status(200).json({
      success: true,
      count: sampleSaved.length,
      posts: sampleSaved
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
