const mongoose = require('mongoose');

const HashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hashtag name is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    count: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

HashtagSchema.index({ count: -1 });

module.exports = mongoose.model('Hashtag', HashtagSchema);
