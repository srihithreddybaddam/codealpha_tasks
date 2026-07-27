import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  Project, 
  Task, 
  ViewMode, 
  AccentColor, 
  FilterState, 
  NotificationItem, 
  User, 
  ChecklistItem, 
  Subtask,
  Comment,
  TaskStatus,
  Column,
  ThemePreset
} from '../types';
import { soundService } from '../services/soundService';
import { useAuth } from './AuthContext';
import { generateStarterWorkspace, createProjectFromTemplate } from '../utils/workspaceGenerator';

interface AppContextType {
  // Navigation & Theme
  currentProject: Project;
  setCurrentProject: (project: Project) => void;
  projects: Project[];
  applyTemplate: (templateId: string, customName?: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  currentTheme: ThemePreset;
  setCurrentTheme: (theme: ThemePreset) => void;

  // Project CRUD
  createProject: (newProjectData: Partial<Project>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  archiveProject: (projectId: string) => void;
  toggleFavoriteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => void;
  isCreateProjectOpen: boolean;
  setIsCreateProjectOpen: (open: boolean) => void;
  editingProject: Project | null;
  setEditingProject: (project: Project | null) => void;

  // Columns Operations
  createColumn: (title: string, color?: string) => void;
  renameColumn: (columnId: TaskStatus, newTitle: string) => void;
  deleteColumn: (columnId: TaskStatus) => void;
  collapseColumn: (columnId: TaskStatus) => void;

  // Data & Tasks
  tasks: Task[];
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredTasks: Task[];
  users: User[];

  // Task Actions
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  createTask: (newTask: Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  duplicateTask: (taskId: string) => void;
  toggleFavoriteTask: (taskId: string) => void;
  
  // Checklist & Subtasks
  toggleChecklistItem: (taskId: string, checklistId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  deleteChecklistItem: (taskId: string, checklistId: string) => void;
  
  addSubtask: (taskId: string, title: string, assigneeId?: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Discussion & Comments
  addComment: (taskId: string, text: string) => void;
  deleteComment: (taskId: string, commentId: string) => void;
  toggleCommentReaction: (taskId: string, commentId: string, emoji: string) => void;

  // Modals & UI Controls
  isCmdKOpen: boolean;
  setIsCmdKOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isNewTaskOpen: boolean;
  setIsNewTaskOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // Realtime Feed Simulation
  latestRealtimeActivity: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const activeProject = useMemo<Project>(() => {
    return currentProject || (projects.length > 0 ? projects[0] : null) || {
      id: 'prj-empty',
      name: `${user?.name || 'Personal'}'s Workspace`,
      key: 'WS',
      description: 'Personal project workspace',
      owner: user?.name || 'Workspace Owner',
      accentColor: 'purple',
      icon: 'Sparkles',
      coverGradient: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
      members: user ? [user] : [],
      columns: [
        { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
        { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
        { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
        { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
      ],
      priority: 'medium',
      category: 'Software Development',
      visibility: 'team',
      status: 'active',
      favorite: true,
      archived: false,
      pinned: true,
      dueDate: '2026-09-01',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
  }, [currentProject, projects, user]);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [viewMode, setViewModeState] = useState<ViewMode>('dashboard');
  const [accentColor, setAccentColor] = useState<AccentColor>('purple');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aether_sound_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem('aether_sound_enabled', JSON.stringify(enabled));
  };

  const [currentTheme, setCurrentTheme] = useState<ThemePreset>('aurora');

  // Load and isolate workspace data per authenticated user
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setCurrentProject(null);
      setTasks([]);
      setUsers([]);
      setNotifications([]);
      return;
    }

    const storageKey = `aether_user_workspace_${user.id}`;
    let workspaceData: { projects: Project[]; tasks: Task[]; notifications: NotificationItem[] };

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        workspaceData = JSON.parse(saved);
      } else {
        workspaceData = generateStarterWorkspace(user);
        localStorage.setItem(storageKey, JSON.stringify(workspaceData));
      }
    } catch {
      workspaceData = generateStarterWorkspace(user);
    }

    setProjects(workspaceData.projects || []);
    setCurrentProject(workspaceData.projects && workspaceData.projects.length > 0 ? workspaceData.projects[0] : null);
    setTasks(workspaceData.tasks || []);
    setNotifications(workspaceData.notifications || []);

    // Build workspace members list from active user + project members
    const allMembers = new Map<string, User>();
    allMembers.set(user.id, user);
    (workspaceData.projects || []).forEach((p) => {
      p.members.forEach((m) => allMembers.set(m.id, m));
    });
    setUsers(Array.from(allMembers.values()));
  }, [user]);

  // Persist user workspace changes to localStorage
  useEffect(() => {
    if (!user || projects.length === 0) return;
    const storageKey = `aether_user_workspace_${user.id}`;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ projects, tasks, notifications }));
    } catch {
      // Storage quota safety
    }
  }, [projects, tasks, notifications, user]);

  // Project Modals State
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Task Modals & Dialogs
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCmdKOpen, setIsCmdKOpen] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState<boolean>(false);
  const [latestRealtimeActivity, setLatestRealtimeActivity] = useState<string | null>(null);

  // Realtime Ticker Simulation
  useEffect(() => {
    if (!user) return;
    const activityFeed = [
      `${user.name} updated project roadmap`,
      'Alex Rivera started a live timer on Web Audio task',
      'Elena Rostova reviewed floating glass palette',
      'Marcus Vance completed 3 checklist items'
    ];

    const interval = setInterval(() => {
      const item = activityFeed[Math.floor(Math.random() * activityFeed.length)];
      setLatestRealtimeActivity(item);
      setTimeout(() => setLatestRealtimeActivity(null), 4000);
    }, 25000);

    return () => clearInterval(interval);
  }, [user]);

  // Filters State
  const [filterState, setFilterState] = useState<FilterState>({
    searchQuery: '',
    priority: 'all',
    assigneeId: 'all',
    label: 'all',
    category: 'all',
    favoriteOnly: false,
    archivedOnly: false,
    visibility: 'all',
    sort: 'recent'
  });

  const setViewMode = (mode: ViewMode) => {
    if (soundEnabled) soundService.playClick();
    setViewModeState(mode);
  };

  // Project Operations
  const createProject = (newProjectData: Partial<Project>) => {
    if (soundEnabled) soundService.playPop();
    const newProj: Project = {
      id: `prj-${Date.now().toString().slice(-4)}`,
      name: newProjectData.name || 'Untitled Project',
      key: newProjectData.key || 'PRJ',
      description: newProjectData.description || '',
      owner: user?.name || newProjectData.owner || 'Workspace Owner',
      accentColor: newProjectData.accentColor || 'purple',
      coverGradient: newProjectData.coverGradient || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
      icon: newProjectData.icon || 'Sparkles',
      members: newProjectData.members || (user ? [user] : []),
      columns: newProjectData.columns || [
        { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
        { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
        { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
        { id: 'in_review', title: 'In Review', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10' },
        { id: 'testing', title: 'QA Testing', color: '#ec4899', accentGradient: 'from-pink-500/20 to-rose-600/10' },
        { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
      ],
      priority: newProjectData.priority || 'medium',
      category: newProjectData.category || 'Software Development',
      visibility: newProjectData.visibility || 'team',
      status: 'active',
      favorite: newProjectData.favorite || false,
      archived: false,
      pinned: false,
      dueDate: newProjectData.dueDate || '2026-09-01',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => [newProj, ...prev]);
    setCurrentProject(newProj);
    setIsCreateProjectOpen(false);
  };

  const applyTemplate = (templateId: string, customName?: string) => {
    if (!user) return;
    if (soundEnabled) soundService.playPop();
    const { project: tmplProj, tasks: tmplTasks } = createProjectFromTemplate(user, templateId, customName);

    setProjects((prev) => [tmplProj, ...prev]);
    setTasks((prev) => [...tmplTasks, ...prev]);
    setCurrentProject(tmplProj);
    setIsCreateProjectOpen(false);
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    if (soundEnabled) soundService.playClick();
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updated = { ...p, ...updates };
          if (activeProject.id === projectId) setCurrentProject(updated);
          return updated;
        }
        return p;
      })
    );
    setEditingProject(null);
  };

  const deleteProject = (projectId: string) => {
    if (soundEnabled) soundService.playClick();
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProject.id === projectId && projects.length > 1) {
      setCurrentProject(projects.find((p) => p.id !== projectId) || null);
    }
  };

  const archiveProject = (projectId: string) => {
    if (soundEnabled) soundService.playClick();
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, archived: !p.archived, status: !p.archived ? 'archived' : 'active' } : p))
    );
  };

  const toggleFavoriteProject = (projectId: string) => {
    if (soundEnabled) soundService.playPop();
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, favorite: !p.favorite } : p))
    );
  };

  const duplicateProject = (projectId: string) => {
    const proj = projects.find((p) => p.id === projectId);
    if (!proj) return;
    if (soundEnabled) soundService.playPop();

    const dup: Project = {
      ...proj,
      id: `prj-${Date.now().toString().slice(-4)}`,
      name: `${proj.name} (Copy)`,
      key: `${proj.key}C`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => [dup, ...prev]);
  };

  // Column Management
  const createColumn = (title: string, color = '#a855f7') => {
    if (!title.trim()) return;
    if (soundEnabled) soundService.playPop();

    const colId = title.toLowerCase().replace(/\s+/g, '_') as TaskStatus;
    const newCol: Column = {
      id: colId,
      title: title.trim(),
      color,
      accentGradient: 'from-purple-500/20 to-indigo-600/10',
      collapsed: false
    };

    const updatedCols = [...activeProject.columns, newCol];
    updateProject(activeProject.id, { columns: updatedCols });
  };

  const renameColumn = (columnId: TaskStatus, newTitle: string) => {
    if (!newTitle.trim()) return;
    const updatedCols = activeProject.columns.map((c) => (c.id === columnId ? { ...c, title: newTitle.trim() } : c));
    updateProject(activeProject.id, { columns: updatedCols });
  };

  const deleteColumn = (columnId: TaskStatus) => {
    if (activeProject.columns.length <= 1) return;
    const updatedCols = activeProject.columns.filter((c) => c.id !== columnId);
    updateProject(activeProject.id, { columns: updatedCols });
  };

  const collapseColumn = (columnId: TaskStatus) => {
    const updatedCols = activeProject.columns.map((c) => (c.id === columnId ? { ...c, collapsed: !c.collapsed } : c));
    updateProject(activeProject.id, { columns: updatedCols });
  };

  // Task Filter Engine
  const filteredTasks = tasks.filter((task) => {
    if (task.projectId !== activeProject.id) return false;

    if (filterState.searchQuery) {
      const q = filterState.searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description.toLowerCase().includes(q);
      const labelMatch = task.labels.some((l) => l.toLowerCase().includes(q));
      const assigneeMatch = task.assignees.some((a) => a.name.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !labelMatch && !assigneeMatch) return false;
    }

    if (filterState.priority !== 'all' && task.priority !== filterState.priority) {
      return false;
    }

    if (filterState.assigneeId !== 'all') {
      const isAssigned = task.assignees.some((a) => a.id === filterState.assigneeId);
      if (!isAssigned) return false;
    }

    if (filterState.label !== 'all' && !task.labels.includes(filterState.label)) {
      return false;
    }

    if (filterState.favoriteOnly && !task.favorite) {
      return false;
    }

    return true;
  });

  // Task Actions
  const moveTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    if (soundEnabled) soundService.playDrop();
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updated = {
            ...task,
            status: newStatus,
            progress: newStatus === 'done' ? 100 : task.progress,
            updatedAt: new Date().toISOString().split('T')[0],
          };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return task;
      })
    );
  };

  const createTask = (newTaskData: Partial<Task>) => {
    if (soundEnabled) soundService.playPop();
    const newTask: Task = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      projectId: activeProject.id,
      title: newTaskData.title || 'Untitled Task',
      description: newTaskData.description || '',
      priority: newTaskData.priority || 'medium',
      status: newTaskData.status || 'todo',
      dueDate: newTaskData.dueDate || new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      startDate: newTaskData.startDate || new Date().toISOString().split('T')[0],
      coverColor: newTaskData.coverColor || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
      assignees: newTaskData.assignees || (user ? [user] : []),
      labels: newTaskData.labels || ['Feature'],
      checklist: newTaskData.checklist || [],
      subtasks: newTaskData.subtasks || [],
      attachments: [],
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: user?.id || 'usr-me',
          userName: user?.name || 'Workspace Owner',
          userAvatar: user?.avatar || '',
          action: 'created task',
          target: newTaskData.title || 'Untitled Task',
          timestamp: 'Just now'
        }
      ],
      estimatedHours: newTaskData.estimatedHours || 8,
      loggedHours: 0,
      progress: 0,
      favorite: false,
      archived: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setTasks((prev) => [newTask, ...prev]);
    setIsNewTaskOpen(false);
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    if (soundEnabled) soundService.playClick();
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeTask?.id === taskId) setActiveTask(null);
  };

  const duplicateTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (soundEnabled) soundService.playPop();

    const dup: Task = {
      ...task,
      id: `tsk-${Date.now().toString().slice(-4)}`,
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTasks((prev) => [dup, ...prev]);
  };

  const toggleFavoriteTask = (taskId: string) => {
    if (soundEnabled) soundService.playPop();
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, favorite: !t.favorite } : t))
    );
  };

  // Checklist Items
  const toggleChecklistItem = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChecklist = t.checklist.map((c) =>
            c.id === checklistId ? { ...c, completed: !c.completed } : c
          );
          const completedCount = newChecklist.filter((c) => c.completed).length;
          const newProgress = newChecklist.length > 0 ? Math.round((completedCount / newChecklist.length) * 100) : t.progress;
          
          if (soundEnabled) {
            if (completedCount === newChecklist.length && newChecklist.length > 0) {
              soundService.playComplete();
            } else {
              soundService.playClick();
            }
          }

          const updated = { ...t, checklist: newChecklist, progress: newProgress };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const addChecklistItem = (taskId: string, text: string) => {
    if (!text.trim()) return;
    if (soundEnabled) soundService.playPop();

    const newItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      text: text.trim(),
      completed: false,
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChecklist = [...t.checklist, newItem];
          const completedCount = newChecklist.filter((c) => c.completed).length;
          const newProgress = Math.round((completedCount / newChecklist.length) * 100);
          const updated = { ...t, checklist: newChecklist, progress: newProgress };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteChecklistItem = (taskId: string, checklistId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newChecklist = t.checklist.filter((c) => c.id !== checklistId);
          const updated = { ...t, checklist: newChecklist };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  // Subtasks
  const addSubtask = (taskId: string, title: string, assigneeId?: string) => {
    if (!title.trim()) return;
    if (soundEnabled) soundService.playPop();

    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false,
      assigneeId,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, subtasks: [...(t.subtasks || []), newSub] };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubs = (t.subtasks || []).map((s) =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
          );
          if (soundEnabled) soundService.playClick();
          const updated = { ...t, subtasks: newSubs };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newSubs = (t.subtasks || []).filter((s) => s.id !== subtaskId);
          const updated = { ...t, subtasks: newSubs };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  // Comments & Discussion
  const addComment = (taskId: string, text: string) => {
    if (!text.trim()) return;
    if (soundEnabled) soundService.playPop();

    const newComment: Comment = {
      id: `cm-${Date.now()}`,
      userId: user?.id || 'usr-me',
      userName: user?.name || 'Workspace Owner',
      userAvatar: user?.avatar || '',
      content: text,
      createdAt: 'Just now',
      reactions: {}
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, comments: [...t.comments, newComment] };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteComment = (taskId: string, commentId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, comments: t.comments.filter((c) => c.id !== commentId) };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const toggleCommentReaction = (taskId: string, commentId: string, emoji: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedComments = t.comments.map((c) => {
            if (c.id === commentId) {
              const rx = { ...(c.reactions || {}) };
              const currentUsers = rx[emoji] || [];
              const myId = user?.id || 'usr-me';
              if (currentUsers.includes(myId)) {
                rx[emoji] = currentUsers.filter((u) => u !== myId);
              } else {
                rx[emoji] = [...currentUsers, myId];
              }
              return { ...c, reactions: rx };
            }
            return c;
          });
          const updated = { ...t, comments: updatedComments };
          if (activeTask?.id === taskId) setActiveTask(updated);
          return updated;
        }
        return t;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Sync Accent CSS Variables
  useEffect(() => {
    const accentMap: Record<AccentColor, { hex: string; glow: string }> = {
      purple: { hex: '#a855f7', glow: 'rgba(168, 85, 247, 0.35)' },
      blue: { hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.35)' },
      cyan: { hex: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)' },
      emerald: { hex: '#10b981', glow: 'rgba(16, 185, 129, 0.35)' },
      pink: { hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.35)' },
      orange: { hex: '#f97316', glow: 'rgba(249, 115, 22, 0.35)' },
      indigo: { hex: '#6366f1', glow: 'rgba(99, 102, 241, 0.35)' },
      amber: { hex: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)' },
    };

    const target = accentMap[accentColor] || accentMap.purple;
    document.documentElement.style.setProperty('--accent-color', target.hex);
    document.documentElement.style.setProperty('--accent-glow', target.glow);
  }, [accentColor]);

  // Sync Theme Mode Class
  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
  }, [isDarkMode]);

  return (
    <AppContext.Provider
      value={{
        currentProject: activeProject,
        setCurrentProject,
        projects,
        applyTemplate,
        viewMode,
        setViewMode,
        accentColor,
        setAccentColor,
        isDarkMode,
        setIsDarkMode,
        soundEnabled,
        setSoundEnabled,
        createProject,
        updateProject,
        deleteProject,
        archiveProject,
        toggleFavoriteProject,
        duplicateProject,
        isCreateProjectOpen,
        setIsCreateProjectOpen,
        editingProject,
        setEditingProject,
        createColumn,
        renameColumn,
        deleteColumn,
        collapseColumn,
        tasks,
        filterState,
        setFilterState,
        filteredTasks,
        users,
        activeTask,
        setActiveTask,
        moveTaskStatus,
        createTask,
        updateTask,
        deleteTask,
        duplicateTask,
        toggleFavoriteTask,
        toggleChecklistItem,
        addChecklistItem,
        deleteChecklistItem,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addComment,
        deleteComment,
        toggleCommentReaction,
        isCmdKOpen,
        setIsCmdKOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isNewTaskOpen,
        setIsNewTaskOpen,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        currentTheme,
        setCurrentTheme,
        latestRealtimeActivity,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
