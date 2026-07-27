import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  Pin, 
  Send, 
  Users, 
  Megaphone
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DiscussionPost {
  id: string;
  author: {
    id?: string;
    name?: string;
    avatar?: string;
    role?: string;
  };
  title: string;
  content: string;
  category: string;
  pinned: boolean;
  createdAt: string;
  reactions: Record<string, string[]>;
  repliesCount: number;
}

export const DiscussionsPage: React.FC = () => {
  const { currentProject, users } = useApp();
  const { user } = useAuth();

  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);

  // Load user specific discussions or starter clean list
  useEffect(() => {
    if (!user) return;
    const storageKey = `aether_discussions_${user.id}`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setDiscussions(JSON.parse(saved));
      } else {
        setDiscussions([
          {
            id: 'disc-welcome',
            author: {
              name: user.name || 'Workspace Admin',
              avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=8b5cf6&color=ffffff`,
              role: user.role || 'Member'
            },
            title: '👋 Welcome to Workspace Discussions',
            content: 'Share project updates, technical RFCs, design decisions, and team announcements here.',
            category: 'Announcements',
            pinned: true,
            createdAt: 'Just now',
            reactions: { '✨': [user.id] },
            repliesCount: 0
          }
        ]);
      }
    } catch {
      setDiscussions([]);
    }
  }, [user]);

  // Persist discussions
  useEffect(() => {
    if (!user || discussions.length === 0) return;
    const storageKey = `aether_discussions_${user.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(discussions));
    } catch {
      // Storage safety
    }
  }, [discussions, user]);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('General');

  const handlePostDiscussion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newDisc: DiscussionPost = {
      id: `disc-${Date.now()}`,
      author: {
        id: user?.id || 'usr-me',
        name: user?.name || 'Workspace Owner',
        avatar: user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=8b5cf6&color=ffffff`,
        role: user?.role || 'Member'
      },
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      pinned: false,
      createdAt: 'Just now',
      reactions: {},
      repliesCount: 0
    };

    setDiscussions([newDisc, ...discussions]);
    setNewTitle('');
    setNewContent('');
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-100">{currentProject?.name || 'Workspace'}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                Project Discussions
              </span>
            </div>
            <p className="text-xs text-slate-400">Team announcements, architectural RFCs, and general workspace threads</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Post Form */}
          <form onSubmit={handlePostDiscussion} className="glass-panel p-4 space-y-3">
            <h3 className="font-bold text-xs text-slate-100">Start a Discussion Topic</h3>
            <input
              type="text"
              placeholder="Enter topic title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="glass-input w-full text-xs font-semibold"
            />
            <textarea
              rows={3}
              placeholder="Describe your discussion topic..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="glass-input w-full text-xs leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="glass-input text-xs font-semibold text-slate-300"
              >
                <option value="General" className="bg-slate-900">General Discussion</option>
                <option value="Announcements" className="bg-slate-900">Announcement</option>
                <option value="Architecture" className="bg-slate-900">Architecture RFC</option>
                <option value="Design" className="bg-slate-900">Design Spec</option>
              </select>

              <button type="submit" className="glass-button-primary text-xs">
                <Send className="w-4 h-4" />
                <span>Publish Thread</span>
              </button>
            </div>
          </form>

          {/* Discussion Cards List */}
          <div className="space-y-4">
            {discussions.map((disc) => {
              const authorAvatar = disc.author?.avatar || user?.avatar || defaultAvatar;
              const authorName = disc.author?.name || user?.name || 'Teammate';

              return (
                <motion.div
                  key={disc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-panel p-5 space-y-3 border ${disc.pinned ? 'border-purple-500/40 bg-purple-950/20' : 'border-white/10'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-100">{disc.title}</h4>
                          {disc.pinned && (
                            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Pin className="w-2.5 h-2.5" /> Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400">By {authorName} • {disc.createdAt}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {disc.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pl-11">{disc.content}</p>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 pl-11">
                    <div className="flex items-center gap-2">
                      {['🔥', '✨', '🚀'].map((emoji) => {
                        const count = (disc.reactions?.[emoji] || []).length;
                        return (
                          <span key={emoji} className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono">
                            {emoji} {count > 0 ? count : 1}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-purple-300 font-semibold">{disc.repliesCount} Replies</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span>Workspace Participants</span>
            </h3>
            <div className="space-y-2">
              {(users.length > 0 ? users : user ? [user] : []).map((usr) => (
                <div key={usr.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 text-xs">
                  <img src={usr.avatar || defaultAvatar} alt={usr.name} className="w-6 h-6 rounded-full object-cover" />
                  <div>
                    <h5 className="font-semibold text-slate-200">{usr.name}</h5>
                    <p className="text-[10px] text-slate-400">{usr.role || 'Member'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
