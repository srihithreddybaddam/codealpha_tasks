const mongoose = require('mongoose');

const MemorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    moment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Moment'
    },
    pinnedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

MemorySchema.index({ user: 1, pinnedAt: -1 });

module.exports = mongoose.model('Memory', MemorySchema);
