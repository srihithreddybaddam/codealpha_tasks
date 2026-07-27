const inMemoryProjects = [
  {
    id: 'prj-1',
    name: 'Aether Glass Engine 3.0',
    key: 'AGE',
    description: 'Next-generation glassmorphism UI framework, web audio engine, and real-time collaboration canvas.',
    owner: 'Sarah Chen',
    members: [
      { id: 'usr-1', name: 'Sarah Chen', email: 'sarah.chen@aether.io', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', role: 'Owner' },
      { id: 'usr-2', name: 'Alex Rivera', email: 'alex.rivera@aether.io', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', role: 'Admin' },
      { id: 'usr-4', name: 'Marcus Vance', email: 'marcus.v@aether.io', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Member' }
    ],
    coverGradient: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
    accentColor: 'purple',
    icon: 'Sparkles',
    priority: 'high',
    category: 'Software Development',
    visibility: 'team',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: true,
    dueDate: '2026-08-15',
    progress: 68,
    createdAt: '2026-06-01'
  },
  {
    id: 'prj-2',
    name: 'Neural AI Core & Automation',
    key: 'NEU',
    description: 'Autonomous task decomposition, smart priority engine, and natural language command parsing.',
    owner: 'Aria Takahashi',
    members: [
      { id: 'usr-5', name: 'Aria Takahashi', email: 'aria.t@aether.io', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', role: 'Owner' },
      { id: 'usr-3', name: 'Elena Rostova', email: 'elena.r@aether.io', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', role: 'Admin' }
    ],
    coverGradient: 'from-cyan-600/50 via-blue-600/40 to-emerald-600/50',
    accentColor: 'cyan',
    icon: 'Cpu',
    priority: 'urgent',
    category: 'AI & Automation',
    visibility: 'private',
    status: 'active',
    favorite: true,
    archived: false,
    pinned: false,
    dueDate: '2026-08-30',
    progress: 45,
    createdAt: '2026-06-15'
  },
  {
    id: 'prj-3',
    name: 'Mobile iOS & Android Hub',
    key: 'MOB',
    description: 'Native metal shader accelerated glass project management app for iPhone & iPad Pro.',
    owner: 'Marcus Vance',
    members: [
      { id: 'usr-4', name: 'Marcus Vance', email: 'marcus.v@aether.io', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', role: 'Owner' }
    ],
    coverGradient: 'from-pink-600/50 via-rose-600/40 to-amber-600/50',
    accentColor: 'pink',
    icon: 'Smartphone',
    priority: 'medium',
    category: 'Mobile App',
    visibility: 'team',
    status: 'active',
    favorite: false,
    archived: false,
    pinned: false,
    dueDate: '2026-09-15',
    progress: 30,
    createdAt: '2026-07-01'
  }
];

// @desc Get all projects with filters & search
// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    let projects = [...inMemoryProjects];

    const { search, category, status, favorite, archived } = req.query;

    if (search) {
      const q = search.toLowerCase();
      projects = projects.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    if (category) {
      projects = projects.filter((p) => p.category === category);
    }

    if (favorite === 'true') {
      projects = projects.filter((p) => p.favorite);
    }

    if (archived === 'true') {
      projects = projects.filter((p) => p.archived);
    } else if (archived === 'false') {
      projects = projects.filter((p) => !p.archived);
    }

    return res.json({ success: true, count: projects.length, projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single project
// @route GET /api/projects/:id
const getProjectById = async (req, res) => {
  const project = inMemoryProjects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  return res.json({ success: true, project });
};

// @desc Create project
// @route POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, key, description, category, coverGradient, accentColor, icon, priority, visibility, dueDate } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const newProject = {
      id: `prj-${Date.now()}`,
      name,
      key: key || name.slice(0, 3).toUpperCase(),
      description: description || '',
      owner: req.user?.name || 'Sarah Chen',
      members: [
        {
          id: req.user?.id || 'usr-1',
          name: req.user?.name || 'Sarah Chen',
          email: req.user?.email || 'sarah.chen@aether.io',
          avatar: req.user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          role: 'Owner'
        }
      ],
      coverGradient: coverGradient || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
      accentColor: accentColor || 'purple',
      icon: icon || 'Sparkles',
      priority: priority || 'medium',
      category: category || 'Software Development',
      visibility: visibility || 'team',
      status: 'active',
      favorite: false,
      archived: false,
      pinned: false,
      dueDate: dueDate || '2026-09-01',
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    inMemoryProjects.unshift(newProject);
    return res.status(201).json({ success: true, project: newProject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update project
// @route PUT /api/projects/:id
const updateProject = async (req, res) => {
  const index = inMemoryProjects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  inMemoryProjects[index] = { ...inMemoryProjects[index], ...req.body };
  return res.json({ success: true, project: inMemoryProjects[index] });
};

// @desc Delete project
// @route DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  const index = inMemoryProjects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  inMemoryProjects.splice(index, 1);
  return res.json({ success: true, message: 'Project deleted successfully' });
};

// @desc Toggle Favorite
// @route POST /api/projects/:id/favorite
const toggleFavorite = async (req, res) => {
  const project = inMemoryProjects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.favorite = !project.favorite;
  return res.json({ success: true, favorite: project.favorite, project });
};

// @desc Archive / Restore Project
// @route POST /api/projects/:id/archive
const archiveProject = async (req, res) => {
  const project = inMemoryProjects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  project.archived = !project.archived;
  project.status = project.archived ? 'archived' : 'active';
  return res.json({ success: true, archived: project.archived, project });
};

// @desc Duplicate Project
// @route POST /api/projects/:id/duplicate
const duplicateProject = async (req, res) => {
  const project = inMemoryProjects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const dup = {
    ...project,
    id: `prj-${Date.now()}`,
    name: `${project.name} (Copy)`,
    key: `${project.key}C`,
    createdAt: new Date().toISOString().split('T')[0]
  };

  inMemoryProjects.unshift(dup);
  return res.status(201).json({ success: true, project: dup });
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  toggleFavorite,
  archiveProject,
  duplicateProject,
};
