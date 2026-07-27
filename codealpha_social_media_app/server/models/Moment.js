const mongoose = require('mongoose');

const MomentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Moment must be associated with a user']
    },
    mediaUrl: {
      type: String,
      required: [true, 'Media URL is required for Moment']
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [2200, 'Moment caption cannot exceed 2200 characters'],
      default: ''
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    viewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

MomentSchema.index({ createdAt: -1 });
MomentSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Moment', MomentSchema);
