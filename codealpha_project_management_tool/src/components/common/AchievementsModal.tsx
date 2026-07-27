import React from 'react';
import { Trophy, Award, Flame, Zap, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const achievements = [
    { id: 'ach-1', title: 'First Workspace', description: 'Created your first glassmorphism project workspace', icon: <Trophy className="w-5 h-5 text-amber-400" />, unlocked: true, date: '2026-06-01' },
    { id: 'ach-2', title: 'Sprint Master', description: 'Completed 100 agile sprint tasks ahead of schedule', icon: <Award className="w-5 h-5 text-purple-400" />, unlocked: true, date: '2026-07-20' },
    { id: 'ach-3', title: 'Fast Worker', description: 'Resolved 5 urgent tasks within 24 hours', icon: <Zap className="w-5 h-5 text-cyan-400" />, unlocked: true, date: '2026-07-22' },
    { id: 'ach-4', title: 'Night Owl', description: 'Shipped a critical deployment after midnight', icon: <Flame className="w-5 h-5 text-rose-400" />, unlocked: true, date: '2026-07-24' },
    { id: 'ach-5', title: 'Consistency Champion', description: 'Maintained 30-day streak of daily task completions', icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />, unlocked: false }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-lg p-6 space-y-6 border border-white/20 shadow-2xl relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-100">User Badges & Achievements</h3>
                <p className="text-xs text-slate-400">Track productivity streaks and milestone unlocks</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3.5 transition-all ${
                  ach.unlocked 
                    ? 'bg-purple-500/10 border-purple-500/30 text-slate-200' 
                    : 'bg-white/5 border-white/5 text-slate-500 opacity-60'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-100">{ach.title}</h4>
                    {ach.unlocked ? (
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">Unlocked {ach.date}</span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">Locked</span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
