const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter is required']
    },
    targetType: {
      type: String,
      enum: ['user', 'post', 'comment'],
      required: [true, 'Target type is required']
    },
    targetId: {
      type: String,
      required: [true, 'Target ID is required']
    },
    reason: {
      type: String,
      enum: ['Spam', 'Harassment', 'Fake Account', 'Violence', 'Adult Content', 'Other'],
      required: [true, 'Report reason is required']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

ReportSchema.index({ reporter: 1, createdAt: -1 });

module.exports = mongoose.model('Report', ReportSchema);
