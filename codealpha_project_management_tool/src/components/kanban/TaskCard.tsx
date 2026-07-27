import React, { useState } from 'react';
import type { Task, Priority } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  CheckSquare, 
  Paperclip, 
  MessageSquare, 
  Clock, 
  Flame, 
  AlertCircle, 
  MoreHorizontal, 
  Star, 
  Copy, 
  Trash2,
  ListTree
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { 
    setActiveTask, 
    duplicateTask, 
    toggleFavoriteTask, 
    deleteTask 
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Flame className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Critical</span>
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>High</span>
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Low
          </span>
        );
      case 'none':
      default:
        return (
          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-full bg-slate-800 text-slate-400 border border-white/5">
            Normal
          </span>
        );
    }
  };

  const completedChecklist = task.checklist.filter((c) => c.completed).length;
  const totalChecklist = task.checklist.length;
  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
  const totalSubtasks = (task.subtasks || []).length;

  return (
    <motion.div
      layoutId={task.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={() => setActiveTask(task)}
      className="glass-card p-4 space-y-3 cursor-pointer group border border-white/10 hover:border-purple-400/50 relative overflow-hidden transition-all duration-200"
    >
      {/* Top Cover Gradient Strip */}
      <div className={`h-1.5 -mx-4 -mt-4 mb-2 bg-gradient-to-r ${task.coverColor || 'from-purple-600 to-indigo-600'}`} />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {getPriorityBadge(task.priority)}
          {task.labels.slice(0, 2).map((lbl) => (
            <span key={lbl} className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-slate-800/80 text-slate-300 border border-white/5">
              {lbl}
            </span>
          ))}
        </div>

        {/* Favorite & Quick Actions */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleFavoriteTask(task.id)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 transition-colors"
          >
            <Star className={`w-3.5 h-3.5 ${task.favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-amber-300'}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-1 w-36 glass-panel p-1.5 z-30 shadow-2xl border border-white/15 space-y-0.5 text-xs"
                >
                  <button
                    onClick={() => {
                      duplicateTask(task.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-white/10 text-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(task.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-bold text-xs text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Description snippet */}
      {task.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Progress Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <span>Task Progress</span>
          <span className="font-mono text-purple-300">{task.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Metrics & Avatars */}
      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Checklist Counter */}
          {totalChecklist > 0 && (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${completedChecklist === totalChecklist ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-slate-400'}`}>
              <CheckSquare className="w-3 h-3" />
              <span className="font-mono text-[10px]">{completedChecklist}/{totalChecklist}</span>
            </div>
          )}

          {/* Subtasks Counter */}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
              <ListTree className="w-3 h-3" />
              <span className="font-mono text-[10px]">{completedSubtasks}/{totalSubtasks}</span>
            </div>
          )}

          {/* Comments Count */}
          {task.comments.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              <span className="font-mono text-[10px]">{task.comments.length}</span>
            </div>
          )}

          {/* Attachments Count */}
          {task.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-slate-400" />
              <span className="font-mono text-[10px]">{task.attachments.length}</span>
            </div>
          )}

          {/* Time Tracking */}
          <div className="flex items-center gap-1 text-[10px] font-mono text-indigo-300">
            <Clock className="w-3 h-3" />
            <span>{task.loggedHours}/{task.estimatedHours}h</span>
          </div>
        </div>

        {/* Assignees Overlapping Avatars */}
        <div className="flex items-center -space-x-1.5">
          {task.assignees.map((usr) => (
            <img
              key={usr.id}
              src={usr.avatar}
              alt={usr.name}
              title={usr.name}
              className="w-5 h-5 rounded-full border border-slate-900 object-cover"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
