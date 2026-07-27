const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must be associated with a user']
    },
    caption: {
      type: String,
      trim: true,
      maxlength: [2200, 'Caption cannot exceed 2200 characters'],
      default: ''
    },
    imageUrl: {
      type: String,
      required: [true, 'Post image URL is required']
    },
    location: {
      type: String,
      trim: true,
      default: ''
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public'
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'published'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    commentsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
PostSchema.index({ createdAt: -1 });
PostSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Post', PostSchema);
