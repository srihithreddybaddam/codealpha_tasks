import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban,
  Kanban, 
  ListTodo, 
  Calendar as CalendarIcon, 
  GanttChartSquare, 
  BarChart3, 
  Users, 
  Megaphone,
  FolderCheck,
  HelpCircle,
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Star,
  Plus,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import type { ViewMode } from '../../types';
import { motion } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    projects,
    setCurrentProject,
    setIsCreateProjectOpen,
    filteredTasks
  } = useApp();

  const { user, logout } = useAuth();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Storage calculation in MB only
  const usedStorageMB = React.useMemo(() => {
    if (!user) return 0;
    try {
      const savedFiles = localStorage.getItem(`aether_user_files_${user.id}`);
      if (!savedFiles) return 0;
      const files = JSON.parse(savedFiles);
      return files.reduce((acc: number, f: any) => {
        const match = (f.size || '').match(/([\d.]+)\s*(MB|KB)/i);
        if (!match) return acc + 1.5;
        const val = parseFloat(match[1]);
        return match[2].toUpperCase() === 'KB' ? acc + val / 1024 : acc + val;
      }, 0);
    } catch {
      return 0;
    }
  }, [user, viewMode]);

  const maxStorageMB = 1024;
  const storagePercent = Math.min(Math.round((usedStorageMB / maxStorageMB) * 100), 100);

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects Directory', icon: <FolderKanban className="w-4 h-4" />, badge: projects.length },
    { id: 'kanban', label: 'Kanban Board', icon: <Kanban className="w-4 h-4" />, badge: filteredTasks.length },
    { id: 'list', label: 'List View', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon className="w-4 h-4" /> },
    { id: 'gantt', label: 'Timeline & Gantt', icon: <GanttChartSquare className="w-4 h-4" /> },
    { id: 'discussions', label: 'Discussions', icon: <Megaphone className="w-4 h-4 text-pink-400" /> },
    { id: 'files', label: 'Files Hub', icon: <FolderCheck className="w-4 h-4 text-cyan-400" /> },
    { id: 'team', label: 'Team Workspace', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics & Insights', icon: <BarChart3 className="w-4 h-4 text-purple-400" /> },
    { id: 'help', label: 'Help & Docs', icon: <HelpCircle className="w-4 h-4 text-emerald-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const favoriteProjects = projects.filter((p) => p.favorite);

  return (
    <aside 
      className={`glass-panel my-4 ml-4 transition-all duration-300 flex flex-col h-[calc(100vh-2rem)] z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Header & Navigation */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="p-4 flex items-center justify-between border-b border-white/10 shrink-0">
          {!isCollapsed && (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace Views
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-auto"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* View Navigation Menu - All sections down to each other */}
        <nav className="p-2 space-y-1 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const isActive = viewMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/20 text-white border border-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3">
                  <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activeSideNav"
                    className="absolute left-0 top-2 bottom-2 w-1 bg-purple-400 rounded-r"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Favorite Projects Quick Access */}
        {!isCollapsed && favoriteProjects.length > 0 && (
          <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold px-1">
              <span className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>Favorites</span>
              </span>
            </div>
            <div className="space-y-1">
              {favoriteProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setCurrentProject(p);
                    setViewMode('project_details');
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-all text-left"
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{p.key}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar Footer & Storage */}
      {!isCollapsed && (
        <div className="p-4 space-y-3 border-t border-white/10 shrink-0">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="glass-button-primary text-xs w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>

          {/* Cloud Storage Gauge in MB Only */}
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-purple-400" />
                <span>Storage</span>
              </span>
              <span className="font-mono text-slate-300">{usedStorageMB.toFixed(1)} / {maxStorageMB} MB</span>
            </div>
            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.max(storagePercent, 2)}%` }} />
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-semibold text-rose-300 transition-all"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </aside>
  );
};
