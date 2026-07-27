const inMemoryTasks = [
  {
    id: 'tsk-101',
    projectId: 'prj-1',
    title: 'Architect Glassmorphism Specular Reflection System',
    description: 'Implement GPU-accelerated CSS backdrop-filter shaders with dynamic mouse lighting refraction and multi-layered specular highlights.',
    priority: 'critical',
    status: 'in_progress',
    dueDate: '2026-07-28',
    startDate: '2026-07-20',
    coverColor: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
    assignees: [
      { id: 'usr-1', name: 'Sarah Chen', email: 'sarah.chen@aether.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Lead Designer' },
      { id: 'usr-4', name: 'Marcus Vance', email: 'marcus.v@aether.io', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Motion Engineer' }
    ],
    labels: ['UI/UX', 'Glassmorphism', 'Shader', 'V4 Spec'],
    checklist: [
      { id: 'chk-1', text: 'Create backdrop-blur-xl utility tokens', completed: true },
      { id: 'chk-2', text: 'Add pseudo-element specular reflection gradients', completed: true },
      { id: 'chk-3', text: 'Optimize sub-pixel rendering performance on 4K displays', completed: false },
      { id: 'chk-4', text: 'Audit dark/light ambient light contrast ratios', completed: false }
    ],
    subtasks: [
      { id: 'sub-1', title: 'Verify Firefox backdrop-filter fallback', completed: true, assigneeId: 'usr-1', dueDate: '2026-07-26' },
      { id: 'sub-2', title: 'Benchmarking GPU memory consumption', completed: false, assigneeId: 'usr-4', dueDate: '2026-07-27' }
    ],
    attachments: [
      { id: 'att-1', name: 'glass_reflection_spec.pdf', size: '2.4 MB', type: 'pdf', url: '#', uploadedAt: '2026-07-21' },
      { id: 'att-2', name: 'hero_mockup.png', size: '4.8 MB', type: 'image', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', uploadedAt: '2026-07-22' }
    ],
    comments: [
      { id: 'cm-1', userId: 'usr-1', userName: 'Sarah Chen', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', content: 'The frosted blur looks incredible! Safari backdrop-filter compatibility checked.', createdAt: '2 hours ago', reactions: { '🔥': ['usr-2', 'usr-4'] } }
    ],
    activities: [
      { id: 'act-1', userId: 'usr-1', userName: 'Sarah Chen', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', action: 'moved task', target: 'To Do → In Progress', timestamp: '3 hours ago' }
    ],
    estimatedHours: 16,
    loggedHours: 10,
    progress: 65,
    favorite: true,
    archived: false,
    createdAt: '2026-07-18',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-102',
    projectId: 'prj-1',
    title: 'Web Audio Synthesizer Micro-Interactions',
    description: 'Build zero-dependency Web Audio API oscillator triggers for card drops, checklist completions, button ripples, and notification popping.',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-07-29',
    startDate: '2026-07-22',
    coverColor: 'from-cyan-600/50 via-blue-600/40 to-emerald-600/50',
    assignees: [
      { id: 'usr-2', name: 'Alex Rivera', email: 'alex.rivera@aether.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Staff Engineer' }
    ],
    labels: ['Audio', 'Frontend', 'Polish'],
    checklist: [
      { id: 'chk-5', text: 'Synthesize sine wave click tick (800Hz -> 400Hz ramp)', completed: true },
      { id: 'chk-6', text: 'Create task complete major chord chime (C5-E5-G5-C6)', completed: true },
      { id: 'chk-7', text: 'Add card drop low frequency triangle wave thump', completed: true },
      { id: 'chk-8', text: 'Expose sound toggle setting in user profile preferences', completed: false }
    ],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 12,
    loggedHours: 9,
    progress: 75,
    favorite: false,
    archived: false,
    createdAt: '2026-07-20',
    updatedAt: '2026-07-25'
  },
  {
    id: 'tsk-103',
    projectId: 'prj-1',
    title: 'Cmd + K Floating Glass Command Palette',
    description: 'Spotlight-style global search modal with fuzzy project navigation, task searching, natural language AI prompt launcher, and hotkey bindings.',
    priority: 'high',
    status: 'in_review',
    dueDate: '2026-07-26',
    startDate: '2026-07-19',
    coverColor: 'from-amber-600/50 via-rose-600/40 to-purple-600/50',
    assignees: [
      { id: 'usr-3', name: 'Elena Rostova', email: 'elena.r@aether.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Systems Architect' }
    ],
    labels: ['Search', 'Cmd+K', 'Keyboard Navigation'],
    checklist: [
      { id: 'chk-9', text: 'Implement keydown listener for Cmd/Ctrl + K', completed: true },
      { id: 'chk-10', text: 'Fuzzy match search algorithm across projects & team', completed: true }
    ],
    subtasks: [],
    attachments: [],
    comments: [],
    activities: [],
    estimatedHours: 8,
    loggedHours: 8,
    progress: 100,
    favorite: false,
    archived: false,
    createdAt: '2026-07-19',
    updatedAt: '2026-07-24'
  }
];

// @desc Get all tasks for a project
// @route GET /api/tasks?projectId=prj-1
const getTasks = async (req, res) => {
  try {
    const { projectId, search, priority, status } = req.query;

    let tasks = [...inMemoryTasks];

    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId);
    }

    if (search) {
      const q = search.toLowerCase();
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    if (priority) {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    if (status) {
      tasks = tasks.filter((t) => t.status === status);
    }

    return res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create task
// @route POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { projectId, title, description, priority, status, dueDate, assignees, labels, estimatedHours, coverColor } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ success: false, message: 'Title and ProjectId are required' });
    }

    const newTask = {
      id: `tsk-${Date.now()}`,
      projectId,
      title,
      description: description || '',
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate || '2026-08-30',
      startDate: new Date().toISOString().split('T')[0],
      coverColor: coverColor || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
      assignees: assignees || [],
      labels: labels || ['Feature'],
      checklist: [],
      subtasks: [],
      attachments: [],
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          userId: req.user?.id || 'usr-1',
          userName: req.user?.name || 'Sarah Chen',
          userAvatar: req.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          action: 'created task',
          target: title,
          timestamp: 'Just now'
        }
      ],
      estimatedHours: estimatedHours || 8,
      loggedHours: 0,
      progress: 0,
      favorite: false,
      archived: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    inMemoryTasks.unshift(newTask);
    return res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update task
// @route PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const index = inMemoryTasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  inMemoryTasks[index] = { ...inMemoryTasks[index], ...req.body, updatedAt: new Date().toISOString().split('T')[0] };
  return res.json({ success: true, task: inMemoryTasks[index] });
};

// @desc Move task status
// @route POST /api/tasks/:id/move
const moveTask = async (req, res) => {
  const { status } = req.body;
  const task = inMemoryTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  task.status = status;
  if (status === 'done') task.progress = 100;
  task.updatedAt = new Date().toISOString().split('T')[0];

  return res.json({ success: true, task });
};

// @desc Delete task
// @route DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  const index = inMemoryTasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  inMemoryTasks.splice(index, 1);
  return res.json({ success: true, message: 'Task deleted' });
};

// @desc Duplicate task
// @route POST /api/tasks/:id/duplicate
const duplicateTask = async (req, res) => {
  const task = inMemoryTasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  const dup = {
    ...task,
    id: `tsk-${Date.now()}`,
    title: `${task.title} (Copy)`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  inMemoryTasks.unshift(dup);
  return res.status(201).json({ success: true, task: dup });
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  moveTask,
  deleteTask,
  duplicateTask,
};
