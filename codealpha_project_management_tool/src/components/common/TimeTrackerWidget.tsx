import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export const TimeTrackerWidget: React.FC = () => {
  const { activeTask, updateTask } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  if (!activeTask) return null;

  const formatTimer = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStopAndLog = () => {
    setIsRunning(false);
    const loggedMins = Math.ceil(seconds / 60);
    const loggedHrs = Math.max(1, Math.round((loggedMins / 60) * 10) / 10);
    updateTask(activeTask.id, {
      loggedHours: (activeTask.loggedHours || 0) + loggedHrs
    });
    setSeconds(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-40 glass-panel p-3.5 border border-purple-500/40 shadow-2xl flex items-center gap-4 text-xs"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
          <Clock className={`w-4 h-4 ${isRunning ? 'animate-spin-slow text-cyan-400' : ''}`} />
        </div>
        <div className="truncate max-w-[140px]">
          <h5 className="font-bold text-slate-100 truncate">{activeTask.title}</h5>
          <span className="font-mono text-purple-300 font-extrabold">{formatTimer(seconds)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`p-2 rounded-xl border transition-all ${
            isRunning ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-purple-500/20 text-purple-200 border-purple-500/30'
          }`}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {seconds > 0 && (
          <button
            onClick={handleStopAndLog}
            className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
            title="Stop and Log Time"
          >
            <Square className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};
