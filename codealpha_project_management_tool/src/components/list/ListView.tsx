import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { TaskStatus } from '../../types';
import { 
  Trash2, 
  Plus, 
  ArrowUpDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export const ListView: React.FC = () => {
  const { 
    filteredTasks, 
    updateTask, 
    deleteTask, 
    setActiveTask, 
    setIsNewTaskOpen
  } = useApp();

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'title' | 'dueDate' | 'priority' | 'status'>('dueDate');
  const [sortAsc, setSortAsc] = useState(true);

  const toggleSelectTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  const handleBulkDelete = () => {
    selectedTaskIds.forEach((id) => deleteTask(id));
    setSelectedTaskIds([]);
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'title') comparison = a.title.localeCompare(b.title);
    if (sortField === 'dueDate') comparison = a.dueDate.localeCompare(b.dueDate);
    if (sortField === 'priority') comparison = a.priority.localeCompare(b.priority);
    if (sortField === 'status') comparison = a.status.localeCompare(b.status);
    return sortAsc ? comparison : -comparison;
  });

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-hidden space-y-4">
      {/* Top Action Bar */}
      <div className="glass-panel p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewTaskOpen(true)}
            className="glass-button-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

          {selectedTaskIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedTaskIds.length})</span>
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {sortedTasks.length} tasks
        </div>
      </div>

      {/* Glass Data Table */}
      <div className="glass-panel flex-1 overflow-x-auto overflow-y-auto border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/60 sticky top-0 backdrop-blur-md text-slate-400 uppercase tracking-wider font-semibold border-b border-white/10 z-10">
            <tr>
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={selectedTaskIds.length === filteredTasks.length && filteredTasks.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => { setSortField('title'); setSortAsc(!sortAsc); }}>
                <div className="flex items-center gap-1">
                  <span>Task Title</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => { setSortField('status'); setSortAsc(!sortAsc); }}>
                <span>Status</span>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => { setSortField('priority'); setSortAsc(!sortAsc); }}>
                <span>Priority</span>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => { setSortField('dueDate'); setSortAsc(!sortAsc); }}>
                <span>Due Date</span>
              </th>
              <th className="p-3.5">
                <span>Assignees</span>
              </th>
              <th className="p-3.5">
                <span>Progress</span>
              </th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-medium text-slate-200">
            {sortedTasks.map((task) => (
              <motion.tr
                key={task.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveTask(task)}
                className="hover:bg-purple-500/10 cursor-pointer transition-colors group"
              >
                <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedTaskIds.includes(task.id)}
                    onChange={() => toggleSelectTask(task.id)}
                    className="rounded border-white/20 bg-white/5 text-purple-500 focus:ring-0 cursor-pointer"
                  />
                </td>
                <td className="p-3.5 font-semibold text-slate-100 group-hover:text-purple-300">
                  <div className="flex items-center gap-2">
                    <span>{task.title}</span>
                    {task.checklist.length > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({task.checklist.filter(c => c.completed).length}/{task.checklist.length})
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className="glass-input text-[11px] font-bold uppercase tracking-wider py-1 px-2 text-purple-300"
                  >
                    <option value="backlog" className="bg-slate-900">Backlog</option>
                    <option value="todo" className="bg-slate-900">To Do</option>
                    <option value="in_progress" className="bg-slate-900">In Progress</option>
                    <option value="in_review" className="bg-slate-900">In Review</option>
                    <option value="done" className="bg-slate-900">Completed</option>
                  </select>
                </td>
                <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                  <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border ${
                    task.priority === 'urgent' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                    task.priority === 'high' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                    'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="p-3.5 font-mono text-slate-400">
                  {task.dueDate}
                </td>
                <td className="p-3.5">
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
                </td>
                <td className="p-3.5 w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{task.progress}%</span>
                  </div>
                </td>
                <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
