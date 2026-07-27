import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  Command, 
  Palette, 
  Trophy, 
  CheckCircle2, 
  Plus, 
  Settings, 
  LogOut,
  Volume2,
  VolumeX,
  ChevronDown,
  FolderKanban,
  Check,
  Sliders,
  ArrowRight,
  Globe,
  Moon,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { soundService } from '../../services/soundService';
import { FloatingGlassPopover } from '../ui/FloatingGlassPopover';
import { AchievementsPopover } from '../ui/AchievementsPopover';
import { InNavbarSearchPopover } from '../ui/InNavbarSearchPopover';
import type { ThemePreset } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentProject, 
    projects,
    setCurrentProject,
    notifications, 
    markAllNotificationsAsRead,
    setIsAIAssistantOpen,
    setIsNewTaskOpen,
    setIsCreateProjectOpen,
    setViewMode,
    currentTheme,
    setCurrentTheme,
    soundEnabled,
    setSoundEnabled
  } = useApp();

  const { user, logout } = useAuth();

  // Popover Toggle States
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Button Trigger References
  const workspaceBtnRef = useRef<HTMLButtonElement | null>(null);
  const themeBtnRef = useRef<HTMLButtonElement | null>(null);
  const notifBtnRef = useRef<HTMLButtonElement | null>(null);
  const userMenuBtnRef = useRef<HTMLButtonElement | null>(null);
  const achievementsBtnRef = useRef<HTMLButtonElement | null>(null);
  const searchInputContainerRef = useRef<HTMLDivElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) soundService.playClick();
  };

  const themeOptions: { 
    id: ThemePreset; 
    name: string; 
    gradient: string; 
    description: string;
    glow: string;
  }[] = [
    { 
      id: 'aurora', 
      name: 'Glass Aurora', 
      gradient: 'from-purple-500 via-indigo-500 to-cyan-400',
      description: 'Purple • Blue • Crystal',
      glow: 'rgba(168, 85, 247, 0.35)'
    },
    { 
      id: 'ocean', 
      name: 'Ocean Breeze', 
      gradient: 'from-blue-500 via-cyan-400 to-emerald-400',
      description: 'Cyan • Deep Navy • Crystal',
      glow: 'rgba(56, 189, 248, 0.35)'
    },
    { 
      id: 'sunset', 
      name: 'Sunset Flame', 
      gradient: 'from-amber-500 via-orange-500 to-rose-500',
      description: 'Warm Amber • Coral • Sunset',
      glow: 'rgba(249, 115, 22, 0.35)'
    },
    { 
      id: 'emerald', 
      name: 'Emerald Mint', 
      gradient: 'from-emerald-500 via-teal-400 to-cyan-400',
      description: 'Mint • Teal • Obsidian',
      glow: 'rgba(16, 185, 129, 0.35)'
    },
    { 
      id: 'purple', 
      name: 'Royal Purple', 
      gradient: 'from-purple-600 via-violet-500 to-indigo-400',
      description: 'Royal Violet • Iris • Glow',
      glow: 'rgba(139, 92, 246, 0.35)'
    },
    { 
      id: 'midnight', 
      name: 'Midnight Void', 
      gradient: 'from-slate-500 via-slate-700 to-slate-900',
      description: 'Slate • Onyx • Dark Glass',
      glow: 'rgba(100, 116, 139, 0.35)'
    },
    { 
      id: 'cyber', 
      name: 'Cyber Neon', 
      gradient: 'from-pink-500 via-purple-500 to-cyan-400',
      description: 'Hot Pink • Neon Cyan • Cyber',
      glow: 'rgba(236, 72, 153, 0.35)'
    },
  ];

  return (
    <>
      <header className="glass-navbar px-4 lg:px-6 py-3 flex items-center justify-between z-30 relative">
        {/* Brand & Workspace Switcher Trigger */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setViewMode('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-purple-200">
                AETHER <span className="text-purple-400 font-extrabold text-xs">PM</span>
              </h1>
              <span className="text-[10px] font-mono text-purple-300/80 uppercase tracking-widest block -mt-1">
                Enterprise SaaS
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Workspace / Active Project Switcher Button */}
          <div className="relative">
            <button
              ref={workspaceBtnRef}
              onClick={() => {
                soundService.playClick();
                setIsWorkspaceOpen(!isWorkspaceOpen);
                setIsThemeOpen(false);
                setIsNotifOpen(false);
                setIsUserMenuOpen(false);
                setIsAchievementsOpen(false);
              }}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all group"
            >
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="truncate max-w-[140px]">{currentProject?.name || 'Workspace'}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                {currentProject?.key || 'WS'}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isWorkspaceOpen ? 'rotate-180 text-purple-300' : ''}`} />
            </button>

            {/* Workspace Switcher Floating Glass Popover */}
            <FloatingGlassPopover
              isOpen={isWorkspaceOpen}
              onClose={() => setIsWorkspaceOpen(false)}
              triggerRef={workspaceBtnRef}
              align="left"
              sideOffset={12}
              width="w-[320px]"
              arrowPosition="left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                      Workspaces ({projects.length})
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsWorkspaceOpen(false);
                      setViewMode('projects');
                    }}
                    className="text-[11px] text-purple-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {projects.map((proj) => {
                    const isSelected = currentProject?.id === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          soundService.playClick();
                          setCurrentProject(proj);
                          setIsWorkspaceOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500/40 text-white shadow-lg shadow-purple-500/10'
                            : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-400 animate-pulse' : 'bg-slate-500'}`} />
                          <div className="truncate">
                            <h4 className="font-bold text-xs text-slate-100 group-hover:text-white truncate">
                              {proj.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {proj.key} • {proj.category}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-purple-500/30 border border-purple-400/50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-purple-300" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      soundService.playPop();
                      setIsWorkspaceOpen(false);
                      setIsCreateProjectOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-xs font-bold text-purple-200 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>
            </FloatingGlassPopover>
          </div>
        </div>

        {/* Expandable In-Navbar Search Experience */}
        <div ref={searchInputContainerRef} className="relative flex-1 max-w-md mx-4 hidden lg:block">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-purple-500/50 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-purple-500/20 text-xs text-slate-300 transition-all shadow-inner">
            <Search className="w-4 h-4 text-purple-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search projects, tasks, members, commands..."
              className="bg-transparent border-none outline-none w-full text-slate-100 placeholder-slate-400 text-xs"
            />
            {searchQuery ? (
              <button onClick={() => setSearchQuery('')} className="p-0.5 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-white/10">
                <Command className="w-3 h-3" /> K
              </kbd>
            )}
          </div>

          {/* Attached In-Navbar Search Popover */}
          <InNavbarSearchPopover
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            triggerRef={searchInputContainerRef}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right Actions & Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Create Task */}
          <button
            onClick={() => {
              soundService.playPop();
              setIsNewTaskOpen(true);
            }}
            className="glass-button-primary text-xs hidden sm:flex"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>

          {/* Aether AI Copilot Launcher */}
          <button
            onClick={() => {
              soundService.playPop();
              setIsAIAssistantOpen(true);
            }}
            className="p-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
            title="Ask Aether AI Assistant"
          >
            <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            <span className="text-xs font-bold hidden xl:inline">Aether AI</span>
          </button>

          {/* Floating Achievements Trigger */}
          <div className="relative">
            <button
              ref={achievementsBtnRef}
              onClick={() => {
                soundService.playClick();
                setIsAchievementsOpen(!isAchievementsOpen);
                setIsWorkspaceOpen(false);
                setIsThemeOpen(false);
                setIsNotifOpen(false);
                setIsUserMenuOpen(false);
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                isAchievementsOpen
                  ? 'bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-amber-300 border-white/10'
              }`}
              title="View Achievements & Badges"
            >
              <Trophy className="w-4 h-4" />
            </button>

            {/* Achievements Floating Glass Popover */}
            <AchievementsPopover
              isOpen={isAchievementsOpen}
              onClose={() => setIsAchievementsOpen(false)}
              triggerRef={achievementsBtnRef}
            />
          </div>

          {/* Premium Floating Live Themes Switcher */}
          <div className="relative">
            <button
              ref={themeBtnRef}
              onClick={() => {
                soundService.playClick();
                setIsThemeOpen(!isThemeOpen);
                setIsWorkspaceOpen(false);
                setIsNotifOpen(false);
                setIsUserMenuOpen(false);
                setIsAchievementsOpen(false);
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                isThemeOpen
                  ? 'bg-purple-500/25 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Theme Switcher"
            >
              <Palette className="w-4 h-4 text-pink-400" />
            </button>

            {/* Live Themes Popover */}
            <FloatingGlassPopover
              isOpen={isThemeOpen}
              onClose={() => setIsThemeOpen(false)}
              triggerRef={themeBtnRef}
              align="right"
              sideOffset={14}
              width="w-[340px] sm:w-[360px]"
              arrowPosition="right"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span className="font-extrabold text-xs uppercase tracking-wider text-slate-100">
                      Live Themes
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    7 Presets
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {themeOptions.map((t) => {
                    const isActive = currentTheme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          soundService.playClick();
                          setCurrentTheme(t.id);
                        }}
                        style={{
                          boxShadow: isActive ? `0 8px 24px ${t.glow}` : undefined,
                        }}
                        className={`w-full group text-left p-3 rounded-2xl border transition-all duration-200 relative overflow-hidden glass-theme-card ${
                          isActive
                            ? 'bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/40 border-purple-400/60 text-white'
                            : 'hover:border-white/25 text-slate-300'
                        }`}
                      >
                        <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${t.gradient} mb-2.5 transition-transform duration-300 group-hover:scale-x-105`} />

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className={`font-bold text-xs tracking-tight transition-colors ${
                              isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                            }`}>
                              {t.name}
                            </h4>
                            <p className="text-[11px] text-slate-400 group-hover:text-slate-300 font-medium mt-0.5">
                              {t.description}
                            </p>
                          </div>

                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-purple-500 text-white shadow-md shadow-purple-500/50 scale-100'
                              : 'bg-white/5 text-transparent border border-white/10 group-hover:border-white/20'
                          }`}>
                            <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'opacity-0'}`} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </FloatingGlassPopover>
          </div>

          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              ref={notifBtnRef}
              onClick={() => {
                soundService.playClick();
                setIsNotifOpen(!isNotifOpen);
                setIsWorkspaceOpen(false);
                setIsThemeOpen(false);
                setIsUserMenuOpen(false);
                setIsAchievementsOpen(false);
              }}
              className={`p-2.5 rounded-xl border transition-all relative ${
                isNotifOpen
                  ? 'bg-purple-500/25 border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-purple-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Center Popover */}
            <FloatingGlassPopover
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              triggerRef={notifBtnRef}
              align="right"
              sideOffset={14}
              width="w-[340px] sm:w-[360px]"
              arrowPosition="right"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-100">
                      Notifications ({unreadCount})
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-purple-300 hover:text-white font-semibold transition-colors"
                    >
                      Mark All Read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                          n.read 
                            ? 'bg-white/5 border-white/5 opacity-60' 
                            : 'bg-purple-500/10 border-purple-500/30 text-slate-100 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{n.title}</span>
                          <span className="text-[9px] font-mono text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </FloatingGlassPopover>
          </div>

          {/* User Profile & Preferences Popover */}
          <div className="relative">
            <button
              ref={userMenuBtnRef}
              onClick={() => {
                soundService.playClick();
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsWorkspaceOpen(false);
                setIsThemeOpen(false);
                setIsNotifOpen(false);
                setIsAchievementsOpen(false);
              }}
              className={`flex items-center gap-2 p-1 rounded-2xl border transition-all ${
                isUserMenuOpen
                  ? 'bg-purple-500/25 border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-7 h-7 rounded-xl object-cover"
              />
            </button>

            {/* User Profile & Preferences Floating Glass Popover */}
            <FloatingGlassPopover
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              triggerRef={userMenuBtnRef}
              align="right"
              sideOffset={14}
              width="w-[300px]"
              arrowPosition="right"
            >
              <div className="space-y-3">
                {/* Profile Summary Card */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                    alt="Profile"
                    className="w-11 h-11 rounded-xl object-cover border border-white/20 shadow-md"
                  />
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-slate-100 truncate">{user?.name || 'Workspace Owner'}</h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'owner@workspace.io'}</p>
                    <span className="inline-block mt-1 px-1.5 py-0.2 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                      {user?.role || 'WORKSPACE OWNER'}
                    </span>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-2 pt-1 border-t border-white/10">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1">
                    Preferences
                  </span>

                  {/* Sound Effects Animated Toggle */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <span className="flex items-center gap-2">
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                      <span className="font-semibold">Sound Effects</span>
                    </span>

                    <button
                      onClick={toggleSound}
                      className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out relative flex items-center ${
                        soundEnabled ? 'bg-purple-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                          soundEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Notifications Preference */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <span className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-400" />
                      <span className="font-semibold">Notifications</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>

                  {/* Dark Mode Locked Indicator */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <span className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold">Appearance</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium">
                      Dark Glass Only
                    </span>
                  </div>

                  {/* Language Selector (Future Ready) */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-200">
                    <span className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold">Language</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-300">
                      English (US)
                    </span>
                  </div>
                </div>

                {/* Account Actions */}
                <div className="space-y-1 pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setViewMode('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    <Settings className="w-4 h-4 text-purple-400" />
                    <span>Platform Settings</span>
                  </button>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-500/20 text-xs font-semibold text-rose-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </FloatingGlassPopover>
          </div>
        </div>
      </header>
    </>
  );
};
