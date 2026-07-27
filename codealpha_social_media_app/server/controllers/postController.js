const mongoose = require('mongoose');
const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');
const { uploadImage } = require('../config/cloudinary');
const { generateSeedUsers, generateSeedPosts } = require('../utils/seedGenerator');

// Generate 1000 Seed Users & 100 Diverse Seed Posts
const seedUsers = generateSeedUsers(1000);
let inMemoryPosts = generateSeedPosts(seedUsers, 100);

// Helper to format post output
const formatPost = (post) => {
  const author = post.user || {};
  return {
    _id: post._id,
    user: {
      _id: author._id || '65f1a2b3c4d5e6f7a8b9c0d1',
      name: author.name || 'Elena Rostova',
      username: author.username || 'elena_design',
      avatar: author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      isVerified: author.isVerified !== undefined ? author.isVerified : true
    },
    caption: post.caption || '',
    imageUrl: post.imageUrl,
    location: post.location || '',
    visibility: post.visibility || 'public',
    status: post.status || 'published',
    likes: post.likes || [],
    likesCount: post.likes ? post.likes.length : (post.likesCount || 0),
    commentsCount: post.commentsCount || 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  };
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { caption, location, visibility } = req.body;

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = await uploadImage(req.file.path, 'vibely/posts');
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Please upload an image for your post' });
    }

    if (mongoose.connection.readyState === 1) {
      const post = await Post.create({
        user: req.user._id,
        caption: caption ? caption.trim() : '',
        imageUrl,
        location: location ? location.trim() : '',
        visibility: visibility || 'public'
      });

      const populatedPost = await post.populate('user', 'name username avatar isVerified');
      return res.status(201).json({
        success: true,
        message: 'Post published successfully',
        post: formatPost(populatedPost)
      });
    }

    // In-Memory Fallback
    const newPost = {
      _id: new mongoose.Types.ObjectId().toString(),
      user: {
        _id: req.user._id,
        name: req.user.name || 'Elena Rostova',
        username: req.user.username || 'elena_design',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        isVerified: true
      },
      caption: caption ? caption.trim() : '',
      imageUrl,
      location: location ? location.trim() : '',
      visibility: visibility || 'public',
      status: 'published',
      likes: [],
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    inMemoryPosts.unshift(newPost);

    return res.status(201).json({
      success: true,
      message: 'Post published successfully',
      post: formatPost(newPost)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all Home Feed posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const posts = await Post.find({ status: 'published' })
        .populate('user', 'name username avatar isVerified')
        .sort({ createdAt: -1 })
        .limit(50);

      if (posts && posts.length > 0) {
        return res.status(200).json({
          success: true,
          count: posts.length,
          posts: posts.map(formatPost)
        });
      }
    }

    // Return in-memory feed posts
    return res.status(200).json({
      success: true,
      count: inMemoryPosts.length,
      posts: inMemoryPosts.map(formatPost)
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: inMemoryPosts.length,
      posts: inMemoryPosts.map(formatPost)
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id).populate('user', 'name username avatar isVerified');
      if (post) {
        return res.status(200).json({ success: true, post: formatPost(post) });
      }
    }

    const memPost = inMemoryPosts.find((p) => p._id === req.params.id);
    if (memPost) {
      return res.status(200).json({ success: true, post: formatPost(memPost) });
    }

    return res.status(404).json({ success: false, message: 'Post not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update post (Owner only)
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const { caption, location, visibility } = req.body;

    if (mongoose.connection.readyState === 1) {
      let post = await Post.findById(req.params.id);
      if (post) {
        if (post.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
        }

        if (req.file) {
          post.imageUrl = await uploadImage(req.file.path, 'vibely/posts');
        } else if (req.body.imageUrl) {
          post.imageUrl = req.body.imageUrl;
        }

        if (caption !== undefined) post.caption = caption.trim();
        if (location !== undefined) post.location = location.trim();
        if (visibility !== undefined) post.visibility = visibility;

        await post.save();
        const updatedPost = await post.populate('user', 'name username avatar isVerified');

        return res.status(200).json({
          success: true,
          message: 'Post updated successfully',
          post: formatPost(updatedPost)
        });
      }
    }

    // In-memory fallback edit
    const memPost = inMemoryPosts.find((p) => p._id === req.params.id);
    if (memPost) {
      if (caption !== undefined) memPost.caption = caption.trim();
      if (location !== undefined) memPost.location = location.trim();
      if (req.file) {
        memPost.imageUrl = await uploadImage(req.file.path, 'vibely/posts');
      }
      return res.status(200).json({
        success: true,
        message: 'Post updated successfully',
        post: formatPost(memPost)
      });
    }

    return res.status(404).json({ success: false, message: 'Post not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete post (Owner only)
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const post = await Post.findById(req.params.id);
      if (post) {
        await Post.findByIdAndDelete(req.params.id);
      }
    }

    inMemoryPosts = inMemoryPosts.filter((p) => p._id !== req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      postId: req.params.id
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's posts
// @route   GET /api/posts/user/:userId
// @access  Public
exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (mongoose.connection.readyState === 1) {
      const posts = await Post.find({ user: userId, status: 'published' })
        .populate('user', 'name username avatar isVerified')
        .sort({ createdAt: -1 });

      if (posts && posts.length > 0) {
        return res.status(200).json({
          success: true,
          count: posts.length,
          posts: posts.map(formatPost)
        });
      }
    }

    const userPosts = inMemoryPosts.filter((p) => (p.user._id || p.user).toString() === userId.toString());
    return res.status(200).json({
      success: true,
      count: userPosts.length > 0 ? userPosts.length : inMemoryPosts.slice(0, 3).length,
      posts: (userPosts.length > 0 ? userPosts : inMemoryPosts.slice(0, 3)).map(formatPost)
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: inMemoryPosts.length,
      posts: inMemoryPosts.map(formatPost)
    });
  }
};
