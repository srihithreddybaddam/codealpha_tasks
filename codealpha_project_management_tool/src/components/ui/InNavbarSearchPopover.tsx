import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Kanban, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Plus,
  Megaphone,
  FolderCheck
} from 'lucide-react';
import { FloatingGlassPopover } from './FloatingGlassPopover';
import { useApp } from '../../context/AppContext';
import type { ViewMode } from '../../types';

interface InNavbarSearchPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const InNavbarSearchPopover: React.FC<InNavbarSearchPopoverProps> = ({
  isOpen,
  onClose,
  triggerRef,
  searchQuery,
  onSearchChange,
}) => {
  const { setViewMode, projects, setCurrentProject, filteredTasks, setActiveTask, setIsNewTaskOpen, setIsAIAssistantOpen } = useApp();

  const navigationShortcuts: { label: string; icon: React.ReactNode; view: ViewMode }[] = [
    { label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />, view: 'dashboard' },
    { label: 'Projects', icon: <FolderKanban className="w-3.5 h-3.5 text-blue-400" />, view: 'projects' },
    { label: 'Kanban', icon: <Kanban className="w-3.5 h-3.5 text-cyan-400" />, view: 'kanban' },
    { label: 'Calendar', icon: <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />, view: 'calendar' },
    { label: 'Analytics', icon: <BarChart3 className="w-3.5 h-3.5 text-amber-400" />, view: 'analytics' },
    { label: 'Discussions', icon: <Megaphone className="w-3.5 h-3.5 text-pink-400" />, view: 'discussions' },
    { label: 'Files Hub', icon: <FolderCheck className="w-3.5 h-3.5 text-indigo-400" />, view: 'files' },
    { label: 'Settings', icon: <Settings className="w-3.5 h-3.5 text-slate-400" />, view: 'settings' },
  ];

  const recentSearches = [
    'Shader glassmorphism backdrop',
    'Socket.io realtime sync',
    'Biometric auth iOS',
    'AGE-101'
  ];

  const recentProjects = projects.slice(0, 3);

  const matchedTasks = searchQuery.trim()
    ? filteredTasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.labels.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <FloatingGlassPopover
      isOpen={isOpen}
      onClose={onClose}
      triggerRef={triggerRef}
      align="left"
      sideOffset={10}
      width="w-[420px] sm:w-[480px]"
      arrowPosition="left"
    >
      <div className="space-y-4">
        {/* If user is typing query, show live search results */}
        {searchQuery.trim() ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                Matching Tasks ({matchedTasks.length})
              </span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {matchedTasks.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No tasks or projects found matching "{searchQuery}"
                </div>
              ) : (
                matchedTasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setActiveTask(task);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 transition-all flex items-center justify-between group"
                  >
                    <div className="truncate">
                      <h4 className="font-bold text-xs text-slate-100 group-hover:text-purple-200 truncate">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {task.priority}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Shortcuts */}
            <div className="space-y-2">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1">
                Navigation Shortcuts
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {navigationShortcuts.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setViewMode(item.view);
                      onClose();
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-slate-300 hover:text-white transition-all group"
                  >
                    <span className="p-1 rounded-lg bg-slate-900/60 border border-white/10">
                      {item.icon}
                    </span>
                    <span className="font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Actions */}
            <div className="space-y-2 pt-1 border-t border-white/10">
              <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1">
                Suggested Actions
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsNewTaskOpen(true);
                    onClose();
                  }}
                  className="flex-1 p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create New Task</span>
                </button>

                <button
                  onClick={() => {
                    setIsAIAssistantOpen(true);
                    onClose();
                  }}
                  className="flex-1 p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-200 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Ask AI Assistant</span>
                </button>
              </div>
            </div>

            {/* Recent Searches & Recent Projects Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
              {/* Recent Searches */}
              <div className="space-y-1.5">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" />
                  Recent Searches
                </span>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => onSearchChange(term)}
                      className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-[11px] text-slate-300 hover:text-white truncate flex items-center justify-between"
                    >
                      <span className="truncate">{term}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="space-y-1.5">
                <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1">
                  <FolderKanban className="w-3 h-3 text-blue-400" />
                  Recent Projects
                </span>
                <div className="space-y-1">
                  {recentProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setCurrentProject(p);
                        setViewMode('kanban');
                        onClose();
                      }}
                      className="w-full text-left p-1.5 rounded-lg hover:bg-white/5 text-[11px] text-slate-300 hover:text-white truncate flex items-center justify-between"
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-[9px] font-mono text-purple-300 font-bold px-1.5 rounded bg-purple-500/20">
                        {p.key}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </FloatingGlassPopover>
  );
};
