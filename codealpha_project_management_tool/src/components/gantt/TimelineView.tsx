import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GanttChartSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const TimelineView: React.FC = () => {
  const { filteredTasks, setActiveTask, currentProject } = useApp();
  const [zoomLevel, setZoomLevel] = useState<'days' | 'weeks' | 'months'>('days');

  const timelineDays = Array.from({ length: 14 }, (_, i) => 20 + i);

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <GanttChartSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-100">{currentProject?.name || 'Workspace'}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                Roadmap Gantt Timeline
              </span>
            </div>
            <p className="text-xs text-slate-400">Chronological task dependencies, duration bars, and release milestones</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
            {['days', 'weeks', 'months'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setZoomLevel(lvl as typeof zoomLevel)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  zoomLevel === lvl ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt Matrix Container */}
      <div className="glass-panel p-6 overflow-x-auto">
        <div className="min-w-[800px] space-y-4">
          {/* Days Header Bar */}
          <div className="grid grid-cols-12 gap-2 text-center text-xs font-bold text-slate-400 pb-3 border-b border-white/10">
            <div className="col-span-3 text-left pl-2">Task Title</div>
            {timelineDays.slice(0, 9).map((day) => (
              <div key={day} className="font-mono">
                Jul {day}
              </div>
            ))}
          </div>

          {/* Task Rows */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                onClick={() => setActiveTask(task)}
                className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 cursor-pointer transition-all text-xs"
              >
                <div className="col-span-3 truncate font-bold text-slate-200 pl-2">
                  {task.title}
                </div>

                <div className="col-span-9 relative h-7 bg-slate-900/60 rounded-lg overflow-hidden border border-white/5 flex items-center px-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(task.progress, 30)}%` }}
                    className={`h-5 rounded-md bg-gradient-to-r ${task.coverColor || 'from-purple-600 to-indigo-600'} flex items-center justify-between px-2 text-[10px] font-mono font-bold text-white shadow-lg`}
                  >
                    <span className="truncate">{task.progress}%</span>
                    <span>{task.dueDate}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
