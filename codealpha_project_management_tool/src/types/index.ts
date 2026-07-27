export type Priority = 'critical' | 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'testing' | 'done';

export type ViewMode = 
  | 'dashboard'
  | 'projects'
  | 'project_details'
  | 'kanban'
  | 'list'
  | 'calendar'
  | 'gantt'
  | 'analytics'
  | 'team'
  | 'discussions'
  | 'files'
  | 'help'
  | 'settings';

export type AccentColor = 
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'emerald'
  | 'pink'
  | 'orange'
  | 'indigo'
  | 'amber';

export type ThemePreset = 
  | 'aurora'
  | 'ocean'
  | 'sunset'
  | 'emerald'
  | 'purple'
  | 'midnight'
  | 'cyber';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  status: 'online' | 'busy' | 'focus' | 'offline';
  assignedTaskCount?: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'image' | 'pdf' | 'code' | 'file';
  url: string;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  reactions?: Record<string, string[]>;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  startDate?: string;
  coverColor?: string;
  coverImage?: string;
  assignees: User[];
  labels: string[];
  checklist: ChecklistItem[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  activities: ActivityLog[];
  estimatedHours: number;
  loggedHours: number;
  progress: number;
  favorite?: boolean;
  archived?: boolean;
  watchers?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
  color: string;
  accentGradient: string;
  wipLimit?: number;
  collapsed?: boolean;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  owner: string;
  accentColor: AccentColor;
  icon: string;
  coverGradient: string;
  members: User[];
  columns: Column[];
  priority: Priority;
  category: string;
  visibility: 'private' | 'team' | 'public';
  status: 'active' | 'completed' | 'archived';
  favorite: boolean;
  archived: boolean;
  pinned: boolean;
  dueDate: string;
  progress: number;
  createdAt: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  coverGradient: string;
  accentColor: AccentColor;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'mention' | 'assignment' | 'due' | 'system';
  linkTaskId?: string;
}

export interface FilterState {
  searchQuery: string;
  priority: Priority | 'all';
  assigneeId: string | 'all';
  label: string | 'all';
  category: string | 'all';
  favoriteOnly: boolean;
  archivedOnly: boolean;
  visibility: string | 'all';
  sort: 'priority' | 'recent' | 'updated' | 'name' | 'progress' | 'dueDate';
}
