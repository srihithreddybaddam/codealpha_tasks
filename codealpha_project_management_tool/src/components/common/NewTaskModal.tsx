import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Priority, TaskStatus } from '../../types';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const NewTaskModal: React.FC = () => {
  const { isNewTaskOpen, setIsNewTaskOpen, createTask, users } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [dueDate, setDueDate] = useState('2026-07-30');
  const [estimatedHours, setEstimatedHours] = useState(8);

  if (!isNewTaskOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask({
      title,
      description,
      priority,
      status,
      dueDate,
      estimatedHours,
      assignees: [users[0]],
      labels: ['New Feature']
    });

    setTitle('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-lg p-6 space-y-4 border border-white/20 relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>Create New Task</span>
            </h3>
            <button
              onClick={() => setIsNewTaskOpen(false)}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Task Title</label>
              <input
                type="text"
                required
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full text-sm font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the task"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="glass-input w-full text-xs font-bold uppercase"
                >
                  <option value="urgent" className="bg-slate-900">Urgent</option>
                  <option value="high" className="bg-slate-900">High</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="low" className="bg-slate-900">Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Initial Column</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="glass-input w-full text-xs font-bold uppercase"
                >
                  <option value="backlog" className="bg-slate-900">Backlog</option>
                  <option value="todo" className="bg-slate-900">To Do</option>
                  <option value="in_progress" className="bg-slate-900">In Progress</option>
                  <option value="in_review" className="bg-slate-900">In Review</option>
                  <option value="done" className="bg-slate-900">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Estimated Scope (Hours)</label>
                <input
                  type="number"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(Number(e.target.value))}
                  className="glass-input w-full text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsNewTaskOpen(false)}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
