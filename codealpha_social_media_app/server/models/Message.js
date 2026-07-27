const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required']
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver is required']
    },
    messageType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text'
    },
    content: {
      type: String,
      trim: true,
      default: ''
    },
    mediaUrl: {
      type: String,
      default: ''
    },
    seenStatus: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);
