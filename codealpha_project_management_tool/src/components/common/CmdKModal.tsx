import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, CheckSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CmdKModal: React.FC = () => {
  const { isCmdKOpen, setIsCmdKOpen, filteredTasks, setActiveTask, setViewMode } = useApp();
  const [query, setQuery] = useState('');

  if (!isCmdKOpen) return null;

  const matchedTasks = filteredTasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.labels.some((l) => l.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="glass-modal w-full max-w-xl p-4 space-y-4 border border-white/20 relative shadow-2xl"
        >
          {/* Search Input Bar */}
          <div className="relative flex items-center border-b border-white/10 pb-3">
            <Search className="w-5 h-5 text-purple-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              placeholder="Search projects, tasks, members, commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent pl-10 pr-10 text-sm font-medium text-slate-100 outline-none"
            />
            <button
              onClick={() => setIsCmdKOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white absolute right-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Views Navigation */}
          {!query && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Navigation Shortcuts</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Kanban Board', mode: 'kanban' },
                  { label: 'Analytics Dashboard', mode: 'analytics' },
                  { label: 'Timeline & Gantt', mode: 'gantt' },
                  { label: 'Team Members', mode: 'team' },
                ].map((item) => (
                  <button
                    key={item.mode}
                    onClick={() => {
                      setViewMode(item.mode as any);
                      setIsCmdKOpen(false);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-purple-500/20 text-left text-xs font-semibold text-slate-200 flex items-center justify-between border border-white/5 hover:border-purple-500/30 transition-all"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          {query && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">Matched Tasks ({matchedTasks.length})</span>
              {matchedTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTask(t);
                    setIsCmdKOpen(false);
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="w-4 h-4 text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-xs text-slate-200">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {t.id} • Due {t.dueDate}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-extrabold uppercase">
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
