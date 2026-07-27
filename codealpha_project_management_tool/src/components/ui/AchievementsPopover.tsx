import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Target, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Lock
} from 'lucide-react';
import { FloatingGlassPopover } from './FloatingGlassPopover';
import { mockAchievements } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

interface AchievementsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export const AchievementsPopover: React.FC<AchievementsPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
}) => {
  const { tasks, projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'unlocked' | 'locked'>('all');

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const currentXP = completedCount * 100 + projects.length * 50;
  const level = Math.max(1, Math.floor(currentXP / 500) + 1);
  const nextLevelXP = level * 500;
  const streakDays = completedCount > 0 ? 1 : 0;

  const levelInfo = {
    level,
    title: level === 1 ? 'Workspace Contributor' : level < 5 ? 'Sprint Strategist' : 'Master Systems Architect',
    currentXP,
    nextLevelXP,
    streakDays,
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'Award': return <Award className="w-4 h-4 text-purple-400" />;
      case 'Zap': return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-rose-400" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Target': return <Target className="w-4 h-4 text-orange-400" />;
      case 'Users': return <Users className="w-4 h-4 text-indigo-400" />;
      default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const userAchievements = mockAchievements.map((ach) => {
    let unlocked = false;
    if (ach.id === 'ach-1') unlocked = projects.length > 0;
    else if (ach.id === 'ach-2') unlocked = completedCount >= 10;
    else if (ach.id === 'ach-3') unlocked = completedCount >= 5;
    else if (ach.id === 'ach-4') unlocked = completedCount >= 3;
    else if (ach.id === 'ach-5') unlocked = completedCount >= 15;
    else if (ach.id === 'ach-6') unlocked = completedCount >= 25;
    return { ...ach, unlocked };
  });

  const filteredAchievements = userAchievements.filter((ach) => {
    if (selectedCategory === 'unlocked') return ach.unlocked;
    if (selectedCategory === 'locked') return !ach.unlocked;
    return true;
  });

  const xpProgressPercent = Math.round((levelInfo.currentXP / levelInfo.nextLevelXP) * 100);

  return (
    <FloatingGlassPopover
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      align="right"
      sideOffset={14}
      width="w-[360px] sm:w-[380px]"
      arrowPosition="right"
    >
      <div className="space-y-3.5">
        {/* Header & Streak Badge */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-100">
                Achievements & XP
              </h3>
              <p className="text-[10px] text-slate-400 font-medium">Level {levelInfo.level} • {levelInfo.title}</p>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-300 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse fill-orange-400" />
            <span>{levelInfo.streakDays} Day Streak</span>
          </div>
        </div>

        {/* XP Progress Card */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Level {levelInfo.level} Progress</span>
            </span>
            <span className="font-mono text-[11px] text-purple-300">
              {levelInfo.currentXP.toLocaleString()} / {levelInfo.nextLevelXP.toLocaleString()} XP
            </span>
          </div>

          <div className="h-2 w-full bg-slate-900/80 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'unlocked', 'locked'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Achievements List */}
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {filteredAchievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-purple-500/10 border-purple-500/30 text-slate-100 shadow-sm hover:border-purple-400/50'
                  : 'bg-white/5 border-white/5 text-slate-400 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-xl border ${
                ach.unlocked ? 'bg-slate-900 border-purple-500/30' : 'bg-slate-950 border-white/5'
              }`}>
                {getIcon(ach.icon)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-xs text-slate-100 truncate">{ach.title}</h4>
                  {ach.unlocked ? (
                    <span className="text-[9px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {ach.unlockedAt}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5 text-slate-500" />
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
                  {ach.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FloatingGlassPopover>
  );
};
