import type { Project, Task, User, NotificationItem, TaskStatus } from '../types';

export interface UserWorkspaceData {
  projects: Project[];
  tasks: Task[];
  notifications: NotificationItem[];
}

export interface ProjectTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  accentColor: 'purple' | 'blue' | 'cyan' | 'pink' | 'emerald' | 'amber';
  coverGradient: string;
  columns: { id: TaskStatus; title: string; color: string; accentGradient: string }[];
  starterTasks: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
    status: TaskStatus;
    labels: string[];
  }[];
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'software_dev',
    name: 'Software Dev & Agile Sprint',
    category: 'Engineering & SaaS',
    description: 'Agile backlog, sprint planning, feature tracking, code reviews, and release deployment.',
    icon: 'Kanban',
    accentColor: 'purple',
    coverGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'Sprint To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Development', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'in_review', title: 'Code Review', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10' },
      { id: 'testing', title: 'QA & Testing', color: '#ec4899', accentGradient: 'from-pink-500/20 to-rose-600/10' },
      { id: 'done', title: 'Shipped', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ],
    starterTasks: [
      {
        title: 'System Architecture & Schema Design',
        description: 'Define relational schemas, API specs, and GPU glass rendering pipeline.',
        priority: 'high',
        status: 'in_progress',
        labels: ['Architecture', 'Core']
      },
      {
        title: 'Implement User Auth & Session Persistence',
        description: 'Build client-side JWT persistence and multi-tenant workspace isolation.',
        priority: 'critical',
        status: 'todo',
        labels: ['Security', 'Auth']
      },
      {
        title: 'Optimize Framer Motion Layout Animations',
        description: 'Ensure 60fps hardware acceleration across all glass modal popovers.',
        priority: 'medium',
        status: 'backlog',
        labels: ['Frontend', 'Performance']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Brand Launch',
    category: 'Growth & Content',
    description: 'Content calendar, social campaign, press release, and brand asset production.',
    icon: 'Sparkles',
    accentColor: 'pink',
    coverGradient: 'from-pink-600 via-rose-600 to-amber-500',
    columns: [
      { id: 'backlog', title: 'Campaign Ideas', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'Copywriting', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'Design Assets', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'in_review', title: 'Final Approval', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10' },
      { id: 'done', title: 'Published', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ],
    starterTasks: [
      {
        title: 'Product Launch Keynote & Landing Page Copy',
        description: 'Craft high-converting headlines and benefit highlights for launch.',
        priority: 'critical',
        status: 'in_progress',
        labels: ['Copywriting', 'Launch']
      },
      {
        title: 'Design Social Media Glass Teaser Graphics',
        description: 'Create 4K banner assets for Twitter/X, LinkedIn, and ProductHunt.',
        priority: 'high',
        status: 'todo',
        labels: ['Design', 'Social']
      }
    ]
  },
  {
    id: 'startup',
    name: 'Startup MVP & Pitch Deck',
    category: 'Business & Ventures',
    description: 'MVP scope, customer validation interviews, financial projections, and investor deck.',
    icon: 'Layers',
    accentColor: 'cyan',
    coverGradient: 'from-cyan-600 via-blue-600 to-indigo-500',
    columns: [
      { id: 'backlog', title: 'Product Ideas', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'Validation', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'MVP Build', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'in_review', title: 'Investor Review', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10' },
      { id: 'done', title: 'Milestone Met', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ],
    starterTasks: [
      {
        title: 'Draft Seed Round Investor Pitch Deck',
        description: '10-slide deck covering problem, solution, market size, and traction metrics.',
        priority: 'high',
        status: 'in_progress',
        labels: ['Fundraising', 'Strategy']
      },
      {
        title: 'Conduct 10 Customer Discovery Interviews',
        description: 'Gather feedback on workflow pain points and pricing tiers.',
        priority: 'medium',
        status: 'todo',
        labels: ['User Research']
      }
    ]
  },
  {
    id: 'student_planner',
    name: 'Student & Academic Planner',
    category: 'Education & Study',
    description: 'Coursework schedules, midterm exams, thesis research, and assignment tracker.',
    icon: 'FolderCheck',
    accentColor: 'emerald',
    coverGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    columns: [
      { id: 'backlog', title: 'Syllabus Tasks', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'Upcoming Assignments', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'Reading & Writing', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'in_review', title: 'Proofreading', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10' },
      { id: 'done', title: 'Submitted', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ],
    starterTasks: [
      {
        title: 'Research Paper Literature Review',
        description: 'Read and cite 5 peer-reviewed papers on distributed systems.',
        priority: 'high',
        status: 'in_progress',
        labels: ['Research', 'Coursework']
      },
      {
        title: 'Study Session for Midterm Exam',
        description: 'Review chapters 1 through 6 notes and practice problem sets.',
        priority: 'urgent',
        status: 'todo',
        labels: ['Exams', 'Study']
      }
    ]
  },
  {
    id: 'personal',
    name: 'Personal Goals & Habit Tracker',
    category: 'Personal & Lifestyle',
    description: 'Weekly schedule, reading lists, fitness goals, and home projects.',
    icon: 'Star',
    accentColor: 'amber',
    coverGradient: 'from-amber-600 via-orange-600 to-rose-500',
    columns: [
      { id: 'backlog', title: 'Someday Goals', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'This Week', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ],
    starterTasks: [
      {
        title: 'Read 2 Tech Architecture Books',
        description: 'Finish Designing Data-Intensive Applications.',
        priority: 'medium',
        status: 'in_progress',
        labels: ['Reading', 'Personal']
      },
      {
        title: 'Setup Weekly Fitness & Hydration Routine',
        description: '30-min morning workout and tracking daily goals.',
        priority: 'low',
        status: 'todo',
        labels: ['Health', 'Habit']
      }
    ]
  }
];

export function generateStarterWorkspace(user: User): UserWorkspaceData {
  const userName = user.name || 'Workspace Owner';

  // Fresh user starts with ZERO projects and ZERO tasks
  const notifications: NotificationItem[] = [
    {
      id: `notif-welcome-${user.id}`,
      title: `Welcome to Aether PM, ${userName}! 👋`,
      message: 'Your clean glass workspace is ready. Click "+ Create Project" or select a template to get started.',
      timestamp: 'Just now',
      read: false,
      type: 'system'
    }
  ];

  return {
    projects: [],
    tasks: [],
    notifications
  };
}

export function createProjectFromTemplate(user: User, templateId: string, customName?: string): { project: Project; tasks: Task[] } {
  const tmpl = PROJECT_TEMPLATES.find((t) => t.id === templateId) || PROJECT_TEMPLATES[0];
  const userName = user.name || 'Workspace Owner';

  const newProj: Project = {
    id: `prj-${Date.now().toString().slice(-4)}`,
    name: customName || `${userName}'s ${tmpl.name}`,
    key: tmpl.id.slice(0, 4).toUpperCase(),
    description: tmpl.description,
    owner: userName,
    accentColor: tmpl.accentColor,
    icon: tmpl.icon,
    coverGradient: tmpl.coverGradient,
    members: [user],
    columns: tmpl.columns,
    priority: 'high',
    category: tmpl.category,
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: true,
    dueDate: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    progress: 25,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const newTasks: Task[] = tmpl.starterTasks.map((t, idx) => ({
    id: `tsk-${Date.now().toString().slice(-4)}-${idx}`,
    projectId: newProj.id,
    title: t.title,
    description: t.description,
    priority: t.priority,
    status: t.status,
    dueDate: new Date(Date.now() + 86400000 * (idx + 3)).toISOString().split('T')[0],
    startDate: new Date().toISOString().split('T')[0],
    coverColor: tmpl.coverGradient,
    assignees: [user],
    labels: t.labels,
    checklist: [
      { id: `c1-${idx}`, text: 'Review requirement specification', completed: true },
      { id: `c2-${idx}`, text: 'Execute implementation phase', completed: false }
    ],
    subtasks: [],
    attachments: [],
    comments: [
      {
        id: `cm-${Date.now()}-${idx}`,
        userId: user.id,
        userName: userName,
        userAvatar: user.avatar,
        content: `Created from ${tmpl.name} template. Ready for development!`,
        createdAt: 'Just now',
        reactions: {}
      }
    ],
    activities: [
      {
        id: `act-${Date.now()}-${idx}`,
        userId: user.id,
        userName: userName,
        userAvatar: user.avatar,
        action: 'added task from template',
        target: t.title,
        timestamp: 'Just now'
      }
    ],
    estimatedHours: 12,
    loggedHours: 3,
    progress: t.status === 'done' ? 100 : 30,
    favorite: false,
    archived: false,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }));

  return { project: newProj, tasks: newTasks };
}
