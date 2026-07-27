const mongoose = require('mongoose');

const SparkSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mediaUrl: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 24 * 60 * 60 * 1000), // 24 hours from creation
      index: { expires: '24h' }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Spark', SparkSchema);
