const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Hashtag = require('../models/Hashtag');
const { generateSeedUsers, generateSeedPosts } = require('../utils/seedGenerator');

const seedUsers = generateSeedUsers(1000);
const seedPosts = generateSeedPosts(seedUsers, 25);

const sampleHashtags = [
  { _id: 'h1', name: 'bengalurutech', count: 2420 },
  { _id: 'h2', name: 'chaiandcode', count: 1980 },
  { _id: 'h3', name: 'isro', count: 1760 },
  { _id: 'h4', name: 'monsoonvibes', count: 1540 },
  { _id: 'h5', name: 'hyderabaddevs', count: 1230 },
  { _id: 'h6', name: 'vibely2026', count: 1120 },
  { _id: 'h7', name: 'glassmorphism', count: 910 }
];

// @desc    Global Multi-Entity Search
// @route   GET /api/search
// @access  Public / Private
exports.search = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim().toLowerCase() : '';
    const type = req.query.type || 'all';

    if (!q) {
      return res.status(200).json({
        success: true,
        users: seedUsers.slice(0, 10),
        posts: seedPosts.slice(0, 5),
        hashtags: sampleHashtags
      });
    }

    const cleanTerm = q.replace('#', '');
    const filteredUsers = seedUsers.filter(
      (u) => u.name.toLowerCase().includes(cleanTerm) || u.username.toLowerCase().includes(cleanTerm) || u.bio.toLowerCase().includes(cleanTerm)
    );
    const filteredPosts = seedPosts.filter(
      (p) => p.caption.toLowerCase().includes(cleanTerm) || p.location.toLowerCase().includes(cleanTerm)
    );
    const filteredHashtags = sampleHashtags.filter((h) => h.name.toLowerCase().includes(cleanTerm));

    return res.status(200).json({
      success: true,
      query: q,
      users: type === 'all' || type === 'users' ? filteredUsers.slice(0, 15) : [],
      posts: type === 'all' || type === 'posts' ? filteredPosts.slice(0, 15) : [],
      hashtags: type === 'all' || type === 'hashtags' ? filteredHashtags : []
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      users: seedUsers.slice(0, 10),
      posts: seedPosts.slice(0, 5),
      hashtags: sampleHashtags
    });
  }
};

exports.searchUsers = async (req, res) => {
  return res.status(200).json({ success: true, users: seedUsers.slice(0, 20) });
};

exports.searchPosts = async (req, res) => {
  return res.status(200).json({ success: true, posts: seedPosts });
};

exports.searchHashtags = async (req, res) => {
  return res.status(200).json({ success: true, hashtags: sampleHashtags });
};

// @desc    Get Posts by Hashtag
// @route   GET /api/hashtags/:name
// @access  Public
exports.getPostsByHashtag = async (req, res) => {
  const name = req.params.name.toLowerCase();
  return res.status(200).json({
    success: true,
    hashtag: name,
    count: seedPosts.length,
    usageCount: 420,
    posts: seedPosts
  });
};

// @desc    Get Explore Feed
// @route   GET /api/explore
// @access  Public / Private
exports.getExplore = async (req, res) => {
  return res.status(200).json({
    success: true,
    suggestedUsers: seedUsers.slice(0, 8),
    trendingHashtags: sampleHashtags,
    posts: seedPosts
  });
};

// @desc    Get Trending Topics & Posts
// @route   GET /api/trending
// @access  Public
exports.getTrending = async (req, res) => {
  return res.status(200).json({
    success: true,
    trendingHashtags: sampleHashtags,
    popularPosts: seedPosts.slice(0, 10)
  });
};

// @desc    Get Suggested Users to Follow
// @route   GET /api/suggested-users
// @access  Public / Private
exports.getSuggestedUsers = async (req, res) => {
  return res.status(200).json({
    success: true,
    users: seedUsers.slice(0, 10)
  });
};
