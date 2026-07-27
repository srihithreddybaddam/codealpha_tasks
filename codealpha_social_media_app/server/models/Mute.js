const mongoose = require('mongoose');

const MuteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    mutedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Muted user is required']
    }
  },
  {
    timestamps: true
  }
);

MuteSchema.index({ user: 1, mutedUser: 1 }, { unique: true });

module.exports = mongoose.model('Mute', MuteSchema);
