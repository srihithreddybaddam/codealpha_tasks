import React from 'react';

export default function ProfileCompletionCard({ profile }) {
  if (!profile) return null;

  // Calculate completion percentage
  let score = 0;
  if (profile.name) score += 20;
  if (profile.avatar && !profile.avatar.includes('default')) score += 20;
  if (profile.coverImage) score += 20;
  if (profile.bio) score += 20;
  if (profile.location || profile.website) score += 20;

  const achievements = [
    { title: 'Founding Creator', icon: 'workspace_premium', desc: 'Joined Vibely 2026 early access' },
    { title: 'First Spark', icon: 'bolt', desc: 'Shared an active 24h Daily Spark' },
    { title: 'Storyteller', icon: 'auto_stories', desc: 'Published high quality community content' }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-surface-container-high shadow-sm space-y-4">
      {/* Profile Completion Meter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-on-surface">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-primary text-base">verified_user</span>
            Profile Completion
          </span>
          <span className="text-primary font-extrabold">{score}%</span>
        </div>
        <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary-container transition-all duration-500 rounded-full"
            style={{ width: `${score}%` }}
          ></div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="space-y-3 pt-2 border-t border-surface-container-high">
        <h4 className="text-xs font-bold uppercase tracking-wider text-outline flex items-center gap-1">
          <span className="material-symbols-outlined text-secondary text-base">military_tech</span>
          Creator Badges & Achievements
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {achievements.map((ach, i) => (
            <div key={i} className="p-3 bg-surface-container-low rounded-2xl flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-secondary/20 to-primary/20 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">{ach.icon}</span>
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-on-surface truncate">{ach.title}</p>
                <p className="text-[10px] text-outline truncate">{ach.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
