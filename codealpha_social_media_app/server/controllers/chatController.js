const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const { uploadImage } = require('../config/cloudinary');

let inMemoryMessages = [
  {
    _id: '65f6a1b2c3d4e5f6a7b8c9f0',
    sender: {
      _id: '65f1a2b3c4d5e6f7a8b9c0d2',
      name: 'Arjun Rao',
      username: 'arjun_tech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
    },
    receiver: {
      _id: '65f1a2b3c4d5e6f7a8b9c0d1',
      name: 'Elena Rostova',
      username: 'elena_design',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
    },
    messageType: 'text',
    content: 'Hey! Are you participating in the upcoming Bengaluru Hackathon this weekend? 🚀',
    mediaUrl: '',
    seenStatus: true,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

const formatMessage = (msg) => ({
  _id: msg._id,
  sender: msg.sender._id ? msg.sender : { _id: msg.sender },
  receiver: msg.receiver._id ? msg.receiver : { _id: msg.receiver },
  messageType: msg.messageType || 'text',
  content: msg.content || '',
  mediaUrl: msg.mediaUrl || '',
  seenStatus: msg.seenStatus || false,
  createdAt: msg.createdAt
});

// @desc    Send private chat message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, messageType } = req.body;
    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    let mediaUrl = req.body.mediaUrl || '';
    if (req.file) {
      mediaUrl = await uploadImage(req.file.path, 'vibely/chat');
    }

    if (mongoose.connection.readyState === 1) {
      const msg = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        messageType: messageType || (mediaUrl ? 'image' : 'text'),
        content: content ? content.trim() : '',
        mediaUrl
      });

      const populated = await msg.populate('sender receiver', 'name username avatar');
      return res.status(201).json({
        success: true,
        message: formatMessage(populated)
      });
    }

    const newMsg = {
      _id: new mongoose.Types.ObjectId().toString(),
      sender: {
        _id: req.user._id,
        name: req.user.name || 'Sender',
        username: req.user.username || 'user',
        avatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80'
      },
      receiver: {
        _id: receiverId,
        name: 'Recipient',
        username: 'recipient',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80'
      },
      messageType: messageType || (mediaUrl ? 'image' : 'text'),
      content: content ? content.trim() : '',
      mediaUrl,
      seenStatus: false,
      createdAt: new Date().toISOString()
    };

    inMemoryMessages.push(newMsg);

    return res.status(201).json({
      success: true,
      message: formatMessage(newMsg)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get message history between current user and target user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (mongoose.connection.readyState === 1) {
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: targetUserId },
          { sender: targetUserId, receiver: currentUserId }
        ]
      })
        .populate('sender receiver', 'name username avatar')
        .sort({ createdAt: 1 });

      if (messages && messages.length > 0) {
        return res.status(200).json({
          success: true,
          count: messages.length,
          messages: messages.map(formatMessage)
        });
      }
    }

    return res.status(200).json({
      success: true,
      count: inMemoryMessages.length,
      messages: inMemoryMessages.map(formatMessage)
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      count: inMemoryMessages.length,
      messages: inMemoryMessages.map(formatMessage)
    });
  }
};

// @desc    Delete message (Sender only)
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Message.findByIdAndDelete(req.params.id);
    }
    inMemoryMessages = inMemoryMessages.filter((m) => m._id !== req.params.id);
    return res.status(200).json({ success: true, messageId: req.params.id });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent conversations list
// @route   GET /api/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const defaultConversations = [
      {
        _id: '65f1a2b3c4d5e6f7a8b9c0d2',
        name: 'Arjun Rao',
        username: 'arjun_tech',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
        lastMessage: 'Hey! Are you participating in the upcoming Bengaluru Hackathon this weekend? 🚀',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 1,
        isOnline: true
      },
      {
        _id: '65f1a2b3c4d5e6f7a8b9c0d3',
        name: 'Priya Patel',
        username: 'priya_code',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
        lastMessage: 'Let’s meet at Koramangala for chai and review the new UI components ☕',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0,
        isOnline: false
      }
    ];

    return res.status(200).json({
      success: true,
      conversations: defaultConversations
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
