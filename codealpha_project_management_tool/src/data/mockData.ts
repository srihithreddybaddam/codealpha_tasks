import type { Project, Task, User, NotificationItem, ProjectTemplate, Achievement } from '../types';

export const mockProjectTemplates: ProjectTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Agile Software Kanban',
    category: 'Software Development',
    description: 'Sprint planning with backlog, WIP limits, code review, and deployment pipelines.',
    coverGradient: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
    accentColor: 'purple',
    icon: 'Sparkles'
  },
  {
    id: 'tmpl-2',
    name: 'Fintech Mobile Application',
    category: 'Fintech Mobile',
    description: 'Security compliance tracking, payment APIs, biometric auth, and QA testing.',
    coverGradient: 'from-blue-600/50 via-cyan-600/40 to-emerald-600/50',
    accentColor: 'blue',
    icon: 'CreditCard'
  },
  {
    id: 'tmpl-3',
    name: 'Design System & UI Kit',
    category: 'Design & UX',
    description: 'Token audits, typography specs, dark glassmorphism, and component library releases.',
    coverGradient: 'from-pink-600/50 via-rose-600/40 to-amber-600/50',
    accentColor: 'pink',
    icon: 'Layers'
  }
];

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'deadline' | 'milestone' | 'meeting' | 'release';
  projectId: string;
  projectName: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigneeNames: string[];
}

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@aether.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Staff Product Designer',
    status: 'online',
    assignedTaskCount: 5
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.rivera@aether.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Systems Architect',
    status: 'online',
    assignedTaskCount: 7
  },
  {
    id: 'usr-3',
    name: 'Elena Rostova',
    email: 'elena.r@aether.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Frontend Engineer',
    status: 'focus',
    assignedTaskCount: 4
  },
  {
    id: 'usr-4',
    name: 'Marcus Vance',
    email: 'marcus.v@aether.io',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'Principal Backend Lead',
    status: 'busy',
    assignedTaskCount: 6
  },
  {
    id: 'usr-5',
    name: 'Aria Takahashi',
    email: 'aria.t@aether.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'VP of Product Engineering',
    status: 'online',
    assignedTaskCount: 3
  },
  {
    id: 'usr-6',
    name: 'David Kova',
    email: 'david.k@aether.io',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    role: 'Security Officer',
    status: 'online',
    assignedTaskCount: 4
  },
  {
    id: 'usr-7',
    name: 'Maya Lin',
    email: 'maya.l@aether.io',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'DevOps Pipeline Lead',
    status: 'focus',
    assignedTaskCount: 5
  },
  {
    id: 'usr-8',
    name: 'Jordan Smith',
    email: 'jordan.s@aether.io',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    role: 'Full Stack Engineer',
    status: 'online',
    assignedTaskCount: 4
  },
  {
    id: 'usr-9',
    name: 'Chloe Bennett',
    email: 'chloe.b@aether.io',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    role: 'Product Marketing Lead',
    status: 'online',
    assignedTaskCount: 3
  },
  {
    id: 'usr-10',
    name: 'Liam Thorne',
    email: 'liam.t@aether.io',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    role: 'QA Automation Lead',
    status: 'online',
    assignedTaskCount: 5
  },
  {
    id: 'usr-11',
    name: 'Zoe Martinez',
    email: 'zoe.m@aether.io',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    role: 'Lead UX Researcher',
    status: 'focus',
    assignedTaskCount: 2
  },
  {
    id: 'usr-12',
    name: 'Samuel O\'Connor',
    email: 'samuel.o@aether.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    role: 'Database Performance Architect',
    status: 'busy',
    assignedTaskCount: 4
  }
];

export const mockProjects: Project[] = [
  {
    id: 'prj-1',
    name: 'TaskFlow SaaS Launch',
    key: 'AGE',
    description: 'Next-generation project workspace featuring GPU-accelerated specular glassmorphism rendering, drag-and-drop Kanban, real-time Socket.io sync, and AI Copilot.',
    owner: 'Sarah Chen',
    accentColor: 'purple',
    icon: 'Sparkles',
    coverGradient: 'from-purple-600 via-indigo-600 to-cyan-500',
    members: mockUsers.slice(0, 5),
    priority: 'critical',
    category: 'Productivity SaaS',
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: true,
    dueDate: '2026-08-30',
    progress: 78,
    createdAt: '2026-05-10',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10', wipLimit: 6 },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10', wipLimit: 4 },
      { id: 'in_review', title: 'In Review', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10', wipLimit: 3 },
      { id: 'testing', title: 'QA Testing', color: '#ec4899', accentGradient: 'from-pink-500/20 to-rose-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-2',
    name: 'Mobile Banking App v3',
    key: 'BANK',
    description: 'Fintech mobile banking application with biometric authorization, real-time ledger sync, multi-currency wallets, and instant P2P payments.',
    owner: 'Alex Rivera',
    accentColor: 'blue',
    icon: 'CreditCard',
    coverGradient: 'from-blue-600 via-cyan-600 to-emerald-500',
    members: [mockUsers[1], mockUsers[2], mockUsers[5], mockUsers[7]],
    priority: 'high',
    category: 'Fintech Mobile',
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: true,
    dueDate: '2026-09-15',
    progress: 62,
    createdAt: '2026-06-01',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-3',
    name: 'E-commerce Platform & Storefront',
    key: 'SHOP',
    description: 'High-throughput e-commerce engine with headless GraphQL APIs, real-time inventory management, and Stripe payments integration.',
    owner: 'Elena Rostova',
    accentColor: 'emerald',
    icon: 'ShoppingBag',
    coverGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    members: [mockUsers[0], mockUsers[2], mockUsers[4], mockUsers[8]],
    priority: 'medium',
    category: 'Retail & E-commerce',
    visibility: 'team',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-10-01',
    progress: 45,
    createdAt: '2026-06-15',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-4',
    name: 'AI Social Platform Engine',
    key: 'GENAI',
    description: 'Generative AI-powered social feed platform featuring real-time stream processing, automated content moderation, and LLM text generation.',
    owner: 'Marcus Vance',
    accentColor: 'pink',
    icon: 'Bot',
    coverGradient: 'from-pink-600 via-purple-600 to-indigo-500',
    members: [mockUsers[3], mockUsers[4], mockUsers[10], mockUsers[11]],
    priority: 'high',
    category: 'GenAI & Social',
    visibility: 'public',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: false,
    dueDate: '2026-08-20',
    progress: 88,
    createdAt: '2026-04-12',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-5',
    name: 'Healthcare Analytics Suite',
    key: 'MEDI',
    description: 'HIPAA-compliant predictive patient outcome dashboard with real-time telemetry monitoring, ML risk scoring, and encrypted FHIR data exports.',
    owner: 'Aria Takahashi',
    accentColor: 'cyan',
    icon: 'Activity',
    coverGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    members: [mockUsers[4], mockUsers[5], mockUsers[9], mockUsers[11]],
    priority: 'critical',
    category: 'Healthtech Intelligence',
    visibility: 'private',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-11-15',
    progress: 35,
    createdAt: '2026-07-01',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-6',
    name: 'Cybersecurity Zero Trust Network',
    key: 'SEC',
    description: 'Zero Trust Network Architecture (ZTNA) with multi-tenant IAM enforcement, automated threat containment, and real-time audit logging.',
    owner: 'David Kova',
    accentColor: 'orange',
    icon: 'Shield',
    coverGradient: 'from-rose-600 via-orange-600 to-amber-500',
    members: [mockUsers[5], mockUsers[1], mockUsers[6], mockUsers[11]],
    priority: 'urgent',
    category: 'Infrastructure Security',
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: true,
    dueDate: '2026-09-30',
    progress: 70,
    createdAt: '2026-05-20',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-7',
    name: 'Cloud Native Kubernetes Hub',
    key: 'KUBE',
    description: 'Multi-cloud Kubernetes cluster orchestrator with automated GitOps deployment pipelines, Prometheus telemetry, and dynamic pod autoscaling.',
    owner: 'Maya Lin',
    accentColor: 'indigo',
    icon: 'Cloud',
    coverGradient: 'from-indigo-600 via-purple-600 to-cyan-500',
    members: [mockUsers[6], mockUsers[1], mockUsers[3], mockUsers[7]],
    priority: 'high',
    category: 'DevOps & Infra',
    visibility: 'team',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-10-20',
    progress: 55,
    createdAt: '2026-06-10',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-8',
    name: 'Autonomous Drone Fleet API',
    key: 'DRONE',
    description: 'Real-time telemetry and flight path navigation API for autonomous delivery drone fleets with collision avoidance and geo-fencing algorithms.',
    owner: 'Jordan Smith',
    accentColor: 'blue',
    icon: 'Compass',
    coverGradient: 'from-blue-600 via-indigo-600 to-purple-600',
    members: [mockUsers[7], mockUsers[2], mockUsers[9], mockUsers[10]],
    priority: 'medium',
    category: 'Hardware & IoT',
    visibility: 'team',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-12-01',
    progress: 40,
    createdAt: '2026-07-05',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-9',
    name: '3D Graphics & Shader Pipeline',
    key: 'SHADER',
    description: 'WebGL and WebGPU real-time ray-tracing engine delivering 60 FPS physically based rendering (PBR) and glass refraction shaders in the browser.',
    owner: 'Elena Rostova',
    accentColor: 'purple',
    icon: 'Layers',
    coverGradient: 'from-purple-600 via-pink-600 to-rose-500',
    members: [mockUsers[2], mockUsers[0], mockUsers[1], mockUsers[4]],
    priority: 'high',
    category: 'Graphics & Gaming',
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: false,
    dueDate: '2026-09-10',
    progress: 82,
    createdAt: '2026-04-01',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  },
  {
    id: 'prj-10',
    name: 'Enterprise ERP Data Warehouse',
    key: 'ERP',
    description: 'Distributed data warehouse pipeline integrating Snowflake, PostgreSQL, and Kafka event streams with real-time financial reporting.',
    owner: 'Samuel O\'Connor',
    accentColor: 'emerald',
    icon: 'Database',
    coverGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    members: [mockUsers[11], mockUsers[3], mockUsers[5], mockUsers[6]],
    priority: 'critical',
    category: 'Enterprise Data',
    visibility: 'team',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-11-30',
    progress: 50,
    createdAt: '2026-06-20',
    columns: [
      { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
      { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
      { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
      { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
    ]
  }
];

export const mockTasks: Task[] = [
  // TaskFlow SaaS Launch (prj-1)
  {
    id: 'tsk-101',
    projectId: 'prj-1',
    title: 'Implement WebGL Shader Glassmorphism Backdrop',
    description: 'Build a hardware-accelerated WebGL canvas shader with dynamic light refractions, smooth Gaussian blur, and responsive ambient movement.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-07-28',
    startDate: '2026-07-20',
    coverColor: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
    assignees: [mockUsers[0], mockUsers[2]],
    labels: ['UI Architecture', 'Graphics', 'High Priority'],
    checklist: [
      { id: 'c1', text: 'Create fragment shader script for specular reflection', completed: true },
      { id: 'c2', text: 'Integrate canvas fallback for low-power mobile devices', completed: true },
      { id: 'c3', text: 'Benchmark 60 FPS performance across browsers', completed: false }
    ],
    subtasks: [
      { id: 's1', title: 'Optimize frame buffers for retina displays', completed: true, assigneeId: 'usr-3' },
      { id: 's2', title: 'Add reduced motion accessibility toggle', completed: false, assigneeId: 'usr-1' }
    ],
    attachments: [
      { id: 'att-1', name: 'glass_specular_v2.glsl', size: '14.2 KB', type: 'code', url: '#', uploadedAt: '2026-07-21' }
    ],
    comments: [
      {
        id: 'cm-1',
        userId: 'usr-3',
        userName: 'Elena Rostova',
        userAvatar: mockUsers[2].avatar,
        content: 'The shader performance looks crisp at 60 FPS on M2 MacBook Pro!',
        createdAt: '2 hours ago',
        reactions: { '🔥': ['usr-1', 'usr-2'] }
      }
    ],
    activities: [
      { id: 'act-1', userId: 'usr-1', userName: 'Sarah Chen', userAvatar: mockUsers[0].avatar, action: 'moved status to', target: 'In Progress', timestamp: '3 hours ago' }
    ],
    estimatedHours: 16,
    loggedHours: 12,
    progress: 75,
    favorite: true,
    archived: false,
    createdAt: '2026-07-20',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-102',
    projectId: 'prj-1',
    title: 'Socket.io Multi-User Realtime Cursor Sync',
    description: 'Implement WebSocket channels to stream live user cursors, active presence pills, and collaborative drag-and-drop state changes.',
    priority: 'urgent',
    status: 'in_review',
    dueDate: '2026-07-29',
    startDate: '2026-07-18',
    coverColor: 'from-blue-600/50 via-cyan-600/40 to-teal-600/50',
    assignees: [mockUsers[1], mockUsers[3]],
    labels: ['Realtime', 'Backend API', 'Socket.io'],
    checklist: [
      { id: 'c4', text: 'Implement cursor throttle at 30ms intervals', completed: true },
      { id: 'c5', text: 'Add room authentication handshake', completed: true }
    ],
    subtasks: [
      { id: 's3', title: 'Heartbeat ping ping-pong disconnect cleanup', completed: true }
    ],
    attachments: [],
    comments: [
      {
        id: 'cm-2',
        userId: 'usr-4',
        userName: 'Marcus Vance',
        userAvatar: mockUsers[3].avatar,
        content: 'PR is up for review. End-to-end socket latency is averaging ~18ms.',
        createdAt: '5 hours ago'
      }
    ],
    activities: [],
    estimatedHours: 24,
    loggedHours: 20,
    progress: 90,
    favorite: false,
    archived: false,
    createdAt: '2026-07-18',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-103',
    projectId: 'prj-1',
    title: 'Design System Typography & Color Tokens',
    description: 'Create unified CSS custom property tokens for glass gradients, typography scales, light/dark accessibility contrast, and micro-animations.',
    priority: 'high',
    status: 'done',
    dueDate: '2026-07-24',
    startDate: '2026-07-15',
    assignees: [mockUsers[0]],
    labels: ['Design System', 'CSS'],
    checklist: [
      { id: 'c6', text: 'Audit Plus Jakarta Sans typography weights', completed: true },
      { id: 'c7', text: 'Generate glass color scale tokens', completed: true }
    ],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 10,
    loggedHours: 10,
    progress: 100,
    favorite: true,
    archived: false,
    createdAt: '2026-07-15',
    updatedAt: '2026-07-24'
  },
  {
    id: 'tsk-104',
    projectId: 'prj-1',
    title: 'Aether AI Copilot Prompt Stream Integration',
    description: 'Integrate streaming LLM completion tokens into the AI assistant side panel with markdown parsing and code action execution.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-08-02',
    startDate: '2026-07-26',
    assignees: [mockUsers[4], mockUsers[1]],
    labels: ['GenAI', 'AI Copilot'],
    checklist: [
      { id: 'c8', text: 'Setup SSE event source listener', completed: false }
    ],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 30,
    loggedHours: 0,
    progress: 0,
    favorite: false,
    archived: false,
    createdAt: '2026-07-24',
    updatedAt: '2026-07-24'
  },
  {
    id: 'tsk-105',
    projectId: 'prj-1',
    title: 'PostgreSQL Database Indexing & Query Tuning',
    description: 'Optimize complex relational queries for task filtering, project summaries, and activity log pagination under heavy traffic load.',
    priority: 'medium',
    status: 'backlog',
    dueDate: '2026-08-10',
    assignees: [mockUsers[3]],
    labels: ['Database', 'Performance'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 16,
    loggedHours: 0,
    progress: 0,
    favorite: false,
    archived: false,
    createdAt: '2026-07-22',
    updatedAt: '2026-07-22'
  },

  // Mobile Banking App v3 (prj-2)
  {
    id: 'tsk-201',
    projectId: 'prj-2',
    title: 'Biometric Passcode & FaceID Authentication',
    description: 'Implement Secure Enclave API hooks for iOS FaceID and Android BiometricPrompt with cryptographic token exchange.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-08-05',
    startDate: '2026-07-22',
    assignees: [mockUsers[1], mockUsers[5]],
    labels: ['Security', 'Mobile', 'iOS/Android'],
    checklist: [
      { id: 'c10', text: 'iOS Keychain storage wrapper', completed: true },
      { id: 'c11', text: 'Android KeyStore fallback integration', completed: false }
    ],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 20,
    loggedHours: 14,
    progress: 65,
    favorite: true,
    archived: false,
    createdAt: '2026-07-22',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-202',
    projectId: 'prj-2',
    title: 'Multi-Currency Instant FX Converter Engine',
    description: 'Real-time exchange rate stream with instant transaction preview and automated low-fee currency conversion.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-08-12',
    assignees: [mockUsers[7]],
    labels: ['Fintech', 'FX API'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 18,
    loggedHours: 0,
    progress: 0,
    favorite: false,
    archived: false,
    createdAt: '2026-07-23',
    updatedAt: '2026-07-23'
  },
  {
    id: 'tsk-203',
    projectId: 'prj-2',
    title: 'P2P Instant Money Transfer API',
    description: 'Sub-second peer-to-peer transfer infrastructure backed by Kafka event streams and automated fraud detection rules.',
    priority: 'critical',
    status: 'done',
    dueDate: '2026-07-20',
    assignees: [mockUsers[1]],
    labels: ['Payments', 'API'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 35,
    loggedHours: 35,
    progress: 100,
    favorite: false,
    archived: false,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-20'
  },

  // E-commerce Platform & Storefront (prj-3)
  {
    id: 'tsk-301',
    projectId: 'prj-3',
    title: 'GraphQL Product Catalog Schema Design',
    description: 'Design extensible GraphQL types for multi-variant products, dynamic attributes, inventory locations, and localized pricing.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-08-01',
    assignees: [mockUsers[2], mockUsers[8]],
    labels: ['GraphQL', 'Architecture'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 14,
    loggedHours: 8,
    progress: 55,
    favorite: false,
    archived: false,
    createdAt: '2026-07-20',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-302',
    projectId: 'prj-3',
    title: 'Stripe Payment Element & Apple Pay Integration',
    description: 'Implement seamless checkout modal supporting 3D Secure 2.0, Apple Pay, Google Pay, and Klarna installment options.',
    priority: 'critical',
    status: 'todo',
    dueDate: '2026-08-15',
    assignees: [mockUsers[0], mockUsers[8]],
    labels: ['Checkout', 'Payments'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 22,
    loggedHours: 0,
    progress: 0,
    favorite: true,
    archived: false,
    createdAt: '2026-07-21',
    updatedAt: '2026-07-21'
  },

  // AI Social Platform Engine (prj-4)
  {
    id: 'tsk-401',
    projectId: 'prj-4',
    title: 'Realtime Feed Recommendation Transformer ML',
    description: 'Deploy PyTorch recommendation model to Triton inference server for 10ms personalized feed ranking.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-07-30',
    assignees: [mockUsers[3], mockUsers[11]],
    labels: ['Machine Learning', 'Python'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 40,
    loggedHours: 32,
    progress: 80,
    favorite: true,
    archived: false,
    createdAt: '2026-07-12',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-402',
    projectId: 'prj-4',
    title: 'Automated Content Moderation Pipeline',
    description: 'Computer vision and NLP pipeline for filtering NSFW images and hate speech text before feed indexing.',
    priority: 'high',
    status: 'done',
    dueDate: '2026-07-22',
    assignees: [mockUsers[10]],
    labels: ['AI Security', 'NLP'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 25,
    loggedHours: 25,
    progress: 100,
    favorite: false,
    archived: false,
    createdAt: '2026-07-08',
    updatedAt: '2026-07-22'
  },

  // Healthcare Analytics Suite (prj-5)
  {
    id: 'tsk-501',
    projectId: 'prj-5',
    title: 'FHIR Medical Records Parser & Encrypted Storage',
    description: 'Build HL7 FHIR v4 parser for hospital EHR data with AES-256 field-level encryption.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-08-18',
    assignees: [mockUsers[5], mockUsers[9]],
    labels: ['HIPAA', 'Encrypted Data'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 32,
    loggedHours: 12,
    progress: 38,
    favorite: true,
    archived: false,
    createdAt: '2026-07-15',
    updatedAt: '2026-07-25'
  },

  // Cybersecurity Zero Trust Network (prj-6)
  {
    id: 'tsk-601',
    projectId: 'prj-6',
    title: 'OAuth2 / OIDC Single Sign-On Identity Provider',
    description: 'Configure Okta and Azure AD SSO integration with TOTP / WebAuthn hardware key MFA enforcement.',
    priority: 'urgent',
    status: 'in_progress',
    dueDate: '2026-08-08',
    assignees: [mockUsers[5], mockUsers[1]],
    labels: ['Identity', 'OAuth2', 'Security'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 28,
    loggedHours: 18,
    progress: 65,
    favorite: true,
    archived: false,
    createdAt: '2026-07-16',
    updatedAt: '2026-07-25'
  },

  // Cloud Native Kubernetes Hub (prj-7)
  {
    id: 'tsk-701',
    projectId: 'prj-7',
    title: 'ArgoCD GitOps Deployment Controller setup',
    description: 'Configure automated GitOps continuous deployment pipeline with blue-green traffic management.',
    priority: 'high',
    status: 'todo',
    dueDate: '2026-08-25',
    assignees: [mockUsers[6], mockUsers[7]],
    labels: ['Kubernetes', 'GitOps', 'DevOps'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 20,
    loggedHours: 0,
    progress: 0,
    favorite: false,
    archived: false,
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19'
  },

  // Autonomous Drone Fleet API (prj-8)
  {
    id: 'tsk-801',
    projectId: 'prj-8',
    title: 'GPS Geo-fencing & Collision Avoidance Algorithm',
    description: 'Implement spatial octree data structures for sub-meter 3D airspace obstacle detection.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-09-01',
    assignees: [mockUsers[7], mockUsers[10]],
    labels: ['Spatial Math', 'Algorithms'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 36,
    loggedHours: 15,
    progress: 42,
    favorite: false,
    archived: false,
    createdAt: '2026-07-18',
    updatedAt: '2026-07-25'
  },

  // 3D Graphics & Shader Pipeline (prj-9)
  {
    id: 'tsk-901',
    projectId: 'prj-9',
    title: 'WebGPU Glass Refraction & Dispersion Shader',
    description: 'High-performance WebGPU compute shader calculating physically accurate Snell\'s law light refraction.',
    priority: 'critical',
    status: 'in_review',
    dueDate: '2026-07-31',
    assignees: [mockUsers[2], mockUsers[0]],
    labels: ['WebGPU', 'Shaders', 'Graphics'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 24,
    loggedHours: 22,
    progress: 92,
    favorite: true,
    archived: false,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-25'
  },

  // Enterprise ERP Data Warehouse (prj-10)
  {
    id: 'tsk-1001',
    projectId: 'prj-10',
    title: 'Snowflake Data Warehouse ETL Pipeline',
    description: 'Stream financial ledger data into Snowflake using Apache Airflow and dbt transformation workflows.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-08-28',
    assignees: [mockUsers[11], mockUsers[3]],
    labels: ['ETL', 'Snowflake', 'BigData'],
    checklist: [],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 45,
    loggedHours: 25,
    progress: 55,
    favorite: true,
    archived: false,
    createdAt: '2026-07-14',
    updatedAt: '2026-07-25'
  }
];

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Task Assigned',
    message: 'Sarah Chen assigned you to "Implement WebGL Shader Glassmorphism Backdrop"',
    timestamp: '10 min ago',
    read: false,
    type: 'assignment',
    linkTaskId: 'tsk-101'
  },
  {
    id: 'notif-2',
    title: 'Code Review Requested',
    message: 'Elena Rostova mentioned you in a comment on "Socket.io Multi-User Realtime Cursor Sync"',
    timestamp: '1 hour ago',
    read: false,
    type: 'mention',
    linkTaskId: 'tsk-102'
  },
  {
    id: 'notif-3',
    title: 'Deadline Reminder',
    message: '"Biometric Passcode & FaceID Authentication" is due in 3 days',
    timestamp: '4 hours ago',
    read: true,
    type: 'due',
    linkTaskId: 'tsk-201'
  },
  {
    id: 'notif-4',
    title: 'Achievement Unlocked',
    message: 'You earned the "Fast Worker" productivity badge! 🎉',
    timestamp: '1 day ago',
    read: true,
    type: 'system'
  },
  {
    id: 'notif-5',
    title: 'Deployment Complete',
    message: 'TaskFlow SaaS Launch v2.4 successfully deployed to production',
    timestamp: '2 days ago',
    read: true,
    type: 'system'
  }
];

export const mockAchievements: Achievement[] = [
  { 
    id: 'ach-1', 
    title: 'First Workspace', 
    description: 'Created your first glassmorphism project workspace', 
    icon: 'Trophy', 
    unlocked: true, 
    unlockedAt: '2026-06-01' 
  },
  { 
    id: 'ach-2', 
    title: 'Sprint Master', 
    description: 'Completed 100 agile sprint tasks ahead of schedule', 
    icon: 'Award', 
    unlocked: true, 
    unlockedAt: '2026-07-20' 
  },
  { 
    id: 'ach-3', 
    title: 'Speed Demon', 
    description: 'Resolved 5 urgent tasks within 24 hours', 
    icon: 'Zap', 
    unlocked: true, 
    unlockedAt: '2026-07-22' 
  },
  { 
    id: 'ach-4', 
    title: 'Night Owl Deployer', 
    description: 'Shipped a critical production deployment after midnight', 
    icon: 'Flame', 
    unlocked: true, 
    unlockedAt: '2026-07-24' 
  },
  { 
    id: 'ach-5', 
    title: 'Consistency Champion', 
    description: 'Maintained a 14-day streak of daily task completions', 
    icon: 'ShieldCheck', 
    unlocked: true, 
    unlockedAt: '2026-07-25' 
  },
  { 
    id: 'ach-6', 
    title: 'Bug Hunter Supreme', 
    description: 'Closed 25 critical QA bug tickets', 
    icon: 'Target', 
    unlocked: false 
  },
  { 
    id: 'ach-7', 
    title: 'Team Architect', 
    description: 'Invited 10+ active engineering members to workspace', 
    icon: 'Users', 
    unlocked: false 
  }
];

export const mockCalendarEvents: CalendarEventItem[] = [
  {
    id: 'evt-1',
    title: 'Sprint 14 Planning & Demo',
    date: '2026-07-27',
    time: '10:00 AM - 11:30 AM',
    type: 'meeting',
    projectId: 'prj-1',
    projectName: 'TaskFlow SaaS Launch',
    priority: 'high',
    assigneeNames: ['Sarah Chen', 'Elena Rostova', 'Alex Rivera']
  },
  {
    id: 'evt-2',
    title: 'WebGL Shader Backdrop Deadline',
    date: '2026-07-28',
    time: '05:00 PM',
    type: 'deadline',
    projectId: 'prj-1',
    projectName: 'TaskFlow SaaS Launch',
    priority: 'critical',
    assigneeNames: ['Sarah Chen', 'Elena Rostova']
  },
  {
    id: 'evt-3',
    title: 'Biometric Auth Security Audit',
    date: '2026-07-29',
    time: '02:00 PM - 03:30 PM',
    type: 'milestone',
    projectId: 'prj-2',
    projectName: 'Mobile Banking App v3',
    priority: 'critical',
    assigneeNames: ['Alex Rivera', 'David Kova']
  },
  {
    id: 'evt-4',
    title: 'AI Social Platform Alpha Release',
    date: '2026-07-30',
    time: '09:00 AM',
    type: 'release',
    projectId: 'prj-4',
    projectName: 'AI Social Platform Engine',
    priority: 'high',
    assigneeNames: ['Marcus Vance', 'Aria Takahashi']
  },
  {
    id: 'evt-5',
    title: 'WebGPU Refraction Shader Review',
    date: '2026-07-31',
    time: '04:00 PM',
    type: 'meeting',
    projectId: 'prj-9',
    projectName: '3D Graphics & Shader Pipeline',
    priority: 'medium',
    assigneeNames: ['Elena Rostova', 'Sarah Chen']
  }
];
