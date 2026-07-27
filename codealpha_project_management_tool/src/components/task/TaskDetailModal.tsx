import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Priority, TaskStatus } from '../../types';
import { 
  X, 
  CheckSquare, 
  ListTree, 
  Paperclip, 
  MessageSquare, 
  Star, 
  Plus, 
  Trash2, 
  Copy, 
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TaskDetailModal: React.FC = () => {
  const { 
    activeTask, 
    setActiveTask, 
    updateTask, 
    deleteTask, 
    duplicateTask, 
    toggleFavoriteTask,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    toggleCommentReaction
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [loggedHours, setLoggedHours] = useState(0);

  const [newChecklistText, setNewChecklistText] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    if (activeTask) {
      setTitle(activeTask.title);
      setDescription(activeTask.description);
      setPriority(activeTask.priority);
      setStatus(activeTask.status);
      setDueDate(activeTask.dueDate || '2026-08-30');
      setStartDate(activeTask.startDate || '2026-08-01');
      setEstimatedHours(activeTask.estimatedHours || 8);
      setLoggedHours(activeTask.loggedHours || 0);
    }
  }, [activeTask]);

  if (!activeTask) return null;

  const handleSaveFieldUpdates = () => {
    updateTask(activeTask.id, {
      title,
      description,
      priority,
      status,
      dueDate,
      startDate,
      estimatedHours: Number(estimatedHours),
      loggedHours: Number(loggedHours)
    });
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addChecklistItem(activeTask.id, newChecklistText.trim());
    setNewChecklistText('');
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(activeTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    addComment(activeTask.id, newCommentText.trim());
    setNewCommentText('');
  };

  const completedChecklist = activeTask.checklist.filter((c) => c.completed).length;
  const totalChecklist = activeTask.checklist.length;
  const completedSubtasks = (activeTask.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (activeTask.subtasks || []).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative border border-white/20 shadow-2xl"
        >
          {/* Top Cover Color Header */}
          <div className={`h-4 w-full bg-gradient-to-r ${activeTask.coverColor || 'from-purple-600 to-indigo-600'}`} />

          {/* Modal Navigation Bar */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-white/10">
                {activeTask.id}
              </span>
              <button
                onClick={() => toggleFavoriteTask(activeTask.id)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Star className={`w-4 h-4 ${activeTask.favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-amber-300'}`} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => duplicateTask(activeTask.id)}
                className="glass-button-secondary text-xs"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Duplicate</span>
              </button>

              <button
                onClick={() => {
                  deleteTask(activeTask.id);
                  setActiveTask(null);
                }}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTask(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Body */}
          <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Editable Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveFieldUpdates}
                className="text-xl font-extrabold text-slate-100 bg-transparent border-b border-transparent hover:border-white/20 focus:border-purple-400 focus:outline-none w-full pb-1"
              />

              {/* Editable Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Description & Specifications
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleSaveFieldUpdates}
                  placeholder="Describe the task"
                  className="glass-input w-full text-xs leading-relaxed"
                />
              </div>

              {/* Subtasks Section */}
              <div className="space-y-3 glass-panel p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                    <ListTree className="w-4 h-4 text-purple-400" />
                    <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                  </h4>
                  {totalSubtasks > 0 && (
                    <span className="text-[10px] font-mono text-purple-300 font-bold">
                      {Math.round((completedSubtasks / totalSubtasks) * 100)}% Complete
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {(activeTask.subtasks || []).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => toggleSubtask(activeTask.id, sub.id)}
                          className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
                        />
                        <span className={sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {sub.title}
                        </span>
                      </label>

                      <button
                        onClick={() => deleteSubtask(activeTask.id, sub.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="glass-input flex-1 text-xs"
                  />
                  <button type="submit" className="glass-button-secondary text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Checklist Section */}
              <div className="space-y-3 glass-panel p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span>Checklist ({completedChecklist}/{totalChecklist})</span>
                  </h4>
                  {totalChecklist > 0 && (
                    <span className="text-[10px] font-mono text-cyan-300 font-bold">
                      {Math.round((completedChecklist / totalChecklist) * 100)}%
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {activeTask.checklist.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(activeTask.id, item.id)}
                          className="rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-0 cursor-pointer"
                        />
                        <span className={item.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                          {item.text}
                        </span>
                      </label>

                      <button
                        onClick={() => deleteChecklistItem(activeTask.id, item.id)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddChecklist} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add checklist item..."
                    value={newChecklistText}
                    onChange={(e) => setNewChecklistText(e.target.value)}
                    className="glass-input flex-1 text-xs"
                  />
                  <button type="submit" className="glass-button-secondary text-xs">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </form>
              </div>

              {/* Attachments Section */}
              <div className="space-y-3 glass-panel p-4">
                <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-amber-400" />
                  <span>Attachments ({activeTask.attachments.length})</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {activeTask.attachments.map((att) => (
                    <div key={att.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5 text-xs">
                      <Paperclip className="w-4 h-4 text-purple-400" />
                      <div className="truncate">
                        <h5 className="font-semibold text-slate-200 truncate">{att.name}</h5>
                        <span className="text-[10px] text-slate-400 font-mono">{att.size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion Comments & Reactions */}
              <div className="space-y-4 glass-panel p-4">
                <h4 className="font-bold text-xs text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-400" />
                  <span>Discussion ({activeTask.comments.length})</span>
                </h4>

                <div className="space-y-3">
                  {activeTask.comments.map((cm) => (
                    <div key={cm.id} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={cm.userAvatar} alt={cm.userName} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-slate-200">{cm.userName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{cm.createdAt}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed pl-8">{cm.content}</p>

                      {/* Emoji Reactions */}
                      <div className="flex items-center gap-2 pl-8 pt-1">
                        {['🔥', '✨', '🚀', '👍'].map((emoji) => {
                          const count = (cm.reactions?.[emoji] || []).length;
                          return (
                            <button
                              key={emoji}
                              onClick={() => toggleCommentReaction(activeTask.id, cm.id, emoji)}
                              className={`px-2 py-0.5 rounded-lg border text-[11px] font-mono transition-all ${
                                count > 0 ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
                              }`}
                            >
                              <span>{emoji}</span> {count > 0 && <span>{count}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    className="glass-input flex-1 text-xs"
                  />
                  <button type="submit" className="glass-button-primary text-xs">
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Attributes Sidebar */}
            <div className="space-y-6">
              <div className="glass-panel p-4 space-y-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-white/10 pb-2">
                  Task Properties
                </h4>

                {/* Priority Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => {
                      setPriority(e.target.value as Priority);
                      handleSaveFieldUpdates();
                    }}
                    className="glass-input w-full text-xs font-bold uppercase"
                  >
                    <option value="critical" className="bg-slate-900">Critical</option>
                    <option value="urgent" className="bg-slate-900">Urgent</option>
                    <option value="high" className="bg-slate-900">High</option>
                    <option value="medium" className="bg-slate-900">Medium</option>
                    <option value="low" className="bg-slate-900">Low</option>
                    <option value="none" className="bg-slate-900">Normal</option>
                  </select>
                </div>

                {/* Status Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Status Column</label>
                  <select
                    value={status}
                    onChange={(e) => {
                      setStatus(e.target.value as TaskStatus);
                      handleSaveFieldUpdates();
                    }}
                    className="glass-input w-full text-xs font-bold uppercase"
                  >
                    <option value="backlog" className="bg-slate-900">Backlog</option>
                    <option value="todo" className="bg-slate-900">To Do</option>
                    <option value="in_progress" className="bg-slate-900">In Progress</option>
                    <option value="in_review" className="bg-slate-900">In Review</option>
                    <option value="testing" className="bg-slate-900">QA Testing</option>
                    <option value="done" className="bg-slate-900">Completed</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={handleSaveFieldUpdates}
                    className="glass-input w-full text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    onBlur={handleSaveFieldUpdates}
                    className="glass-input w-full text-xs font-mono"
                  />
                </div>

                {/* Time Tracking */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Est. Hours</label>
                    <input
                      type="number"
                      value={estimatedHours}
                      onChange={(e) => setEstimatedHours(Number(e.target.value))}
                      onBlur={handleSaveFieldUpdates}
                      className="glass-input w-full text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-400">Logged Hours</label>
                    <input
                      type="number"
                      value={loggedHours}
                      onChange={(e) => setLoggedHours(Number(e.target.value))}
                      onBlur={handleSaveFieldUpdates}
                      className="glass-input w-full text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Assignees */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <label className="text-xs font-semibold text-slate-300 block">Assigned Contributors</label>
                  <div className="space-y-1.5">
                    {activeTask.assignees.map((usr) => (
                      <div key={usr.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-white/5 text-xs">
                        <img src={usr.avatar} alt={usr.name} className="w-5 h-5 rounded-full object-cover" />
                        <span className="font-semibold text-slate-200">{usr.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
