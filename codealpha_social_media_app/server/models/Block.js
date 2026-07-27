const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    blockedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blocked user is required']
    }
  },
  {
    timestamps: true
  }
);

BlockSchema.index({ user: 1, blockedUser: 1 }, { unique: true });

module.exports = mongoose.model('Block', BlockSchema);
