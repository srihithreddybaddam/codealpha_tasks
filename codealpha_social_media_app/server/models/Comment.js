const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Comment must be associated with a post']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must be associated with a user']
    },
    content: {
      type: String,
      required: [true, 'Comment content cannot be empty'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  {
    timestamps: true
  }
);

CommentSchema.index({ post: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', CommentSchema);
