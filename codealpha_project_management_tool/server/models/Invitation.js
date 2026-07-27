const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true
    },
    senderName: {
      type: String,
      default: 'Sarah Chen'
    },
    receiverEmail: {
      type: String,
      required: [true, 'Please provide receiver email'],
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['Owner', 'Admin', 'Member', 'Guest'],
      default: 'Member'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending'
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Invitation', InvitationSchema);
