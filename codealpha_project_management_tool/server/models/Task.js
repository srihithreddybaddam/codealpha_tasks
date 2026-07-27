const mongoose = require('mongoose');

const ChecklistItemSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
});

const SubtaskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  assigneeId: String,
  dueDate: String
});

const AttachmentSchema = new mongoose.Schema({
  name: String,
  size: String,
  type: String,
  url: String,
  uploadedAt: String
});

const CommentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userAvatar: String,
  content: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
  reactions: { type: Map, of: [String], default: {} }
});

const ActivityLogSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  userAvatar: String,
  action: String,
  target: String,
  timestamp: { type: String, default: () => new Date().toISOString() }
});

const TaskSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['backlog', 'todo', 'in_progress', 'in_review', 'testing', 'done'],
      default: 'todo'
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low', 'none'],
      default: 'medium'
    },
    labels: [String],
    assignees: [
      {
        id: String,
        name: String,
        email: String,
        avatar: String,
        role: String
      }
    ],
    checklist: [ChecklistItemSchema],
    subtasks: [SubtaskSchema],
    attachments: [AttachmentSchema],
    comments: [CommentSchema],
    activities: [ActivityLogSchema],
    estimatedHours: { type: Number, default: 8 },
    loggedHours: { type: Number, default: 0 },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    dueDate: { type: String, default: '2026-08-15' },
    startDate: { type: String, default: '2026-08-01' },
    coverColor: { type: String, default: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50' },
    favorite: { type: Boolean, default: false },
    archived: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Task', TaskSchema);
