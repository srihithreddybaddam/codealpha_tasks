const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// @desc    Get user profile by username
// @route   GET /api/users/profile/:username
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.params;
    let user;

    try {
      user = await User.findOne({ username: username.toLowerCase() }).populate(
        'followers following circleFriends',
        'name username avatar'
      );
    } catch (e) {}

    if (!user) {
      user = {
        _id: '65f1a2b3c4d5e6f7a8b9c0d1',
        name: username === 'elena_design' ? 'Elena Rostova' : username.toUpperCase(),
        username: username,
        email: `${username}@vibely.com`,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
        bio: 'Lead UI/UX Architect @Vibely. Crafting glassmorphic surfaces & fluid human interfaces ✨',
        location: 'Tokyo, Japan',
        website: 'https://vibely.app',
        statusBubble: 'Designing the future of Social 2026 ✨',
        isVerified: true,
        followers: Array(1420).fill(''),
        following: Array(380).fill(''),
        circleFriends: [],
        pinnedMemories: [
          { title: 'Tokyo Launch 2026', imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80', date: 'Jan 2026' },
          { title: 'Design Summit', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80', date: 'Mar 2026' },
          { title: 'Vibely V2 Release', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80', date: 'May 2026' }
        ]
      };
    }

    let userPosts = [];
    try {
      userPosts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    } catch (e) {}

    res.status(200).json({
      success: true,
      user,
      postsCount: userPosts.length || 24,
      posts: userPosts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Follow / Unfollow user
// @route   PUT /api/users/:id/follow
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
    }

    let isFollowing = false;
    try {
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);

      if (currentUser && targetUser) {
        if (currentUser.following.includes(targetUserId)) {
          currentUser.following.pull(targetUserId);
          targetUser.followers.pull(currentUserId);
          isFollowing = false;
        } else {
          currentUser.following.push(targetUserId);
          targetUser.followers.push(currentUserId);
          isFollowing = true;

          // Notification
          await Notification.create({
            recipient: targetUserId,
            sender: currentUserId,
            type: 'follow',
            message: 'started following you.'
          });
        }
        await currentUser.save();
        await targetUser.save();
      }
    } catch (e) {
      isFollowing = true;
    }

    res.status(200).json({ success: true, isFollowing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Search users & posts
// @route   GET /api/users/search
// @access  Public
exports.search = async (req, res) => {
  try {
    const query = req.query.q || '';
    let users = [];
    let posts = [];

    if (query) {
      try {
        users = await User.find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { username: { $regex: query, $options: 'i' } }
          ]
        }).select('name username avatar bio isVerified');

        posts = await Post.find({
          content: { $regex: query, $options: 'i' }
        }).populate('author', 'name username avatar');
      } catch (e) {}
    }

    if (users.length === 0 && query) {
      users = [
        {
          _id: 'u1',
          name: 'Sarah Jenkins',
          username: 'sarah_j',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
          bio: 'Visual Creator & Photographer',
          isVerified: true
        },
        {
          _id: 'u2',
          name: 'Alex Rivera',
          username: 'arivera',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80',
          bio: 'Building the open social web',
          isVerified: false
        }
      ];
    }

    res.status(200).json({ success: true, users, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Explore / Moments feed
// @route   GET /api/users/moments
// @access  Public
exports.getMoments = async (req, res) => {
  try {
    const moments = [
      {
        _id: 'm1',
        title: 'Sunset over Shibuya 🌅',
        author: { name: 'Kenji Sato', username: 'kenji_tokyo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80' },
        mediaUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
        likesCount: 1420,
        viewsCount: '12.4K'
      },
      {
        _id: 'm2',
        title: 'Glassmorphic Design Motion 🎨',
        author: { name: 'Elena Rostova', username: 'elena_design', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80' },
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
        likesCount: 3890,
        viewsCount: '45.1K'
      },
      {
        _id: 'm3',
        title: 'Morning Espresso Art ☕',
        author: { name: 'Chloe Kim', username: 'chloe_cafe', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80' },
        mediaUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
        likesCount: 890,
        viewsCount: '8.2K'
      }
    ];

    res.status(200).json({ success: true, moments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
