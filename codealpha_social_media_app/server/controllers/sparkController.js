const mongoose = require('mongoose');
const DailySpark = require('../models/DailySpark');
const { generateSeedUsers } = require('../utils/seedGenerator');

const seedUsers = generateSeedUsers(10);

const uniqueSparks = [
  {
    _id: 's1',
    user: { _id: seedUsers[0]._id, name: 'Aarav Sharma', username: 'aarav_dev', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    caption: 'Evening chai break in Bengaluru! ☕✨',
    views: Array(142).fill('viewer_id'),
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: 's2',
    user: { _id: seedUsers[1]._id, name: 'Riya Rao', username: 'riya_design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    caption: 'Designing new glassmorphic components 🎨',
    views: Array(210).fill('viewer_id'),
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    _id: 's3',
    user: { _id: seedUsers[2]._id, name: 'Arjun Patel', username: 'arjun_tech', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    caption: 'Late night hackathon code grind 💻⚡',
    views: Array(98).fill('viewer_id'),
    createdAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    _id: 's4',
    user: { _id: seedUsers[3]._id, name: 'Ananya Reddy', username: 'ananya_photo', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
    caption: 'Monsoon rain in Western Ghats 🌧️🍃',
    views: Array(315).fill('viewer_id'),
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    _id: 's5',
    user: { _id: seedUsers[4]._id, name: 'Rohan Verma', username: 'rohan_travel', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    caption: 'Sunset at Hampi stone ruins 🏛️🌅',
    views: Array(264).fill('viewer_id'),
    createdAt: new Date(Date.now() - 18000000).toISOString()
  },
  {
    _id: 's6',
    user: { _id: seedUsers[5]._id, name: 'Priya Iyer', username: 'priya_chef', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80',
    caption: 'Fresh homemade South Indian filter coffee ☕😋',
    views: Array(180).fill('viewer_id'),
    createdAt: new Date(Date.now() - 21600000).toISOString()
  },
  {
    _id: 's7',
    user: { _id: seedUsers[6]._id, name: 'Aditya Nair', username: 'aditya_fit', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    caption: 'Morning 5 AM workout session 💪🔥',
    views: Array(125).fill('viewer_id'),
    createdAt: new Date(Date.now() - 25200000).toISOString()
  },
  {
    _id: 's8',
    user: { _id: seedUsers[7]._id, name: 'Kavya Gupta', username: 'kavya_art', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    caption: 'Digital canvas sketching in progress 🎨✨',
    views: Array(340).fill('viewer_id'),
    createdAt: new Date(Date.now() - 28800000).toISOString()
  },
  {
    _id: 's9',
    user: { _id: seedUsers[8]._id, name: 'Karthik Joshi', username: 'karthik_cloud', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    caption: 'ISRO satellite launch broadcast 🚀🇮🇳',
    views: Array(490).fill('viewer_id'),
    createdAt: new Date(Date.now() - 32400000).toISOString()
  },
  {
    _id: 's10',
    user: { _id: seedUsers[9]._id, name: 'Sneha Deshmukh', username: 'sneha_code', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80' },
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    caption: 'Web3 & AI workshop in Hyderabad 💡🚀',
    views: Array(205).fill('viewer_id'),
    createdAt: new Date(Date.now() - 36000000).toISOString()
  }
];

// @desc    Get active 24h sparks
// @route   GET /api/sparks
// @access  Public / Private
exports.getSparks = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: uniqueSparks.length,
    sparks: uniqueSparks
  });
};

// @desc    Create a new spark
// @route   POST /api/sparks
// @access  Private
exports.createSpark = async (req, res) => {
  const newSpark = {
    _id: `s_${Date.now()}`,
    user: {
      _id: req.user._id,
      name: req.user.name || 'Vibely Creator',
      username: req.user.username || 'creator',
      avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    },
    mediaUrl: req.file ? `/uploads/${req.file.filename}` : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    caption: req.body.caption || '',
    views: [req.user._id],
    createdAt: new Date().toISOString()
  };

  return res.status(201).json({
    success: true,
    spark: newSpark
  });
};

// @desc    View spark
// @route   POST /api/sparks/:id/view
// @access  Private
exports.viewSpark = async (req, res) => {
  return res.status(200).json({ success: true, sparkId: req.params.id });
};

// @desc    Delete spark
// @route   DELETE /api/sparks/:id
// @access  Private
exports.deleteSpark = async (req, res) => {
  return res.status(200).json({ success: true, sparkId: req.params.id });
};
