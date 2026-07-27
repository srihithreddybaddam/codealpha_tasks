const mongoose = require('mongoose');

const DailySparkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Spark must be associated with a user']
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required for Daily Spark']
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [200, 'Spark caption cannot exceed 200 characters'],
      default: ''
    },
    views: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: '24h' }
    }
  },
  {
    timestamps: true
  }
);

DailySparkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('DailySpark', DailySparkSchema);
