const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    key: {
      type: String,
      required: [true, 'Please provide a project key'],
      uppercase: true,
      maxlength: [10, 'Project key cannot exceed 10 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    owner: {
      type: String,
      default: 'Sarah Chen',
    },
    members: [
      {
        id: String,
        name: String,
        email: String,
        avatar: String,
        role: String,
      },
    ],
    coverGradient: {
      type: String,
      default: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
    },
    accentColor: {
      type: String,
      default: 'purple',
    },
    icon: {
      type: String,
      default: 'Sparkles',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    category: {
      type: String,
      default: 'Software Development',
    },
    visibility: {
      type: String,
      enum: ['private', 'team', 'public'],
      default: 'team',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: String,
      default: '2026-08-31',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', ProjectSchema);
