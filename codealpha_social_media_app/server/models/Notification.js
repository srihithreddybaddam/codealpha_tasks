const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required']
    },
    type: {
      type: String,
      enum: ['follow', 'like', 'comment', 'reply', 'circle', 'message'],
      required: [true, 'Notification type is required']
    },
    referenceId: {
      type: String,
      default: ''
    },
    readStatus: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
