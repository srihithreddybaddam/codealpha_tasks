import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export const TeamView: React.FC = () => {
  const { users, filteredTasks } = useApp();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviteModalOpen(false);
    setInviteEmail('');
  };

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-100">Team Workspace & Member Capacity</h2>
            <p className="text-xs text-slate-400">Manage contributor roles, workload capacity, and email invitations</p>
          </div>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="glass-button-primary text-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Teammate</span>
        </button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((usr) => {
          const userTasks = filteredTasks.filter((t) => t.assignees.some((a) => a.id === usr.id));
          const completedUserTasks = userTasks.filter((t) => t.status === 'done').length;

          return (
            <motion.div
              key={usr.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-5 space-y-4 border border-white/10 hover:border-purple-400/40 relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={usr.avatar} alt={usr.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-white/20" />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                      usr.status === 'online' ? 'bg-emerald-400' : usr.status === 'focus' ? 'bg-purple-400' : 'bg-amber-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{usr.name}</h3>
                    <p className="text-[11px] text-purple-300 font-medium">{usr.role}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{usr.email}</p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {usr.id === 'usr-1' ? 'Owner' : 'Admin'}
                </span>
              </div>

              {/* Workload Capacity Meter */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Assigned Workload</span>
                  <span className="font-mono text-purple-300">{userTasks.length} Tasks</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                    style={{ width: `${Math.min(userTasks.length * 20, 100)}%` }}
                  />
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center text-xs">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Completed</span>
                  <span className="font-bold text-emerald-300 font-mono">{completedUserTasks}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-[10px] text-slate-400 block">Active</span>
                  <span className="font-bold text-purple-300 font-mono">{userTasks.length - completedUserTasks}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Invite Teammate Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <form onSubmit={handleSendInvite} className="glass-modal w-full max-w-md p-6 space-y-4 border border-white/20">
            <h3 className="font-bold text-base text-slate-100">Invite Teammate via Email</h3>
            <p className="text-xs text-slate-400">An invitation email will be dispatched with workspace join credentials</p>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Teammate Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="glass-input w-full text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Workspace Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="glass-input w-full text-xs"
              >
                <option value="Admin" className="bg-slate-900">Admin (Full Access)</option>
                <option value="Member" className="bg-slate-900">Member (Edit & Contribute)</option>
                <option value="Guest" className="bg-slate-900">Guest (Read Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
