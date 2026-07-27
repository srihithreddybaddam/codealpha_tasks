import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PROJECT_TEMPLATES } from '../../utils/workspaceGenerator';
import { 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Plus, 
  FolderKanban,
  Star,
  ArrowRight,
  Kanban,
  Layers,
  Zap,
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    projects, 
    filteredTasks, 
    setIsAIAssistantOpen,
    setIsCreateProjectOpen,
    setCurrentProject,
    setViewMode,
    applyTemplate
  } = useApp();

  const { user } = useAuth();

  const todayFormatted = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  const totalProjects = projects.length;
  const isFirstTimeUser = totalProjects === 0;

  // ----------------------------------------------------
  // ONBOARDING MODE (FIRST-TIME USER EXPERIENCE)
  // ----------------------------------------------------
  if (isFirstTimeUser) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-8">
        {/* Onboarding Welcome Hero Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 lg:p-10 bg-gradient-to-r from-purple-900/40 via-slate-900/90 to-cyan-900/40 border-purple-500/30 flex flex-wrap items-center justify-between gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Workspace Setup Guide
              </span>
              <span className="text-xs text-slate-400 font-mono">{todayFormatted}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">{user?.name || 'Workspace Owner'}</span> 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Welcome to your fresh Aether PM workspace. Start by creating a blank project or select a pre-configured starter template below to begin organizing your workflow.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="glass-button-primary text-xs px-5 py-3 shadow-lg shadow-purple-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>Create Blank Project</span>
              </button>
              <button
                onClick={() => setViewMode('help')}
                className="glass-button-secondary text-xs px-5 py-3"
              >
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Explore Guide & Documentation</span>
              </button>
            </div>
          </div>

          <div className="w-full lg:w-auto flex justify-center">
            <div className="w-24 h-24 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-2xl relative">
              <Sparkles className="w-12 h-12 text-purple-400 animate-pulse" />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-400/30 border border-cyan-400 flex items-center justify-center">
                <Zap className="w-3 h-3 text-cyan-300" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 1-Click Starter Template Library Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Choose a Project Template</span>
              </h2>
              <p className="text-xs text-slate-400">Select a pre-configured workflow template to launch your first project with starter tasks</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              5 Templates Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PROJECT_TEMPLATES.map((tmpl) => (
              <motion.div
                key={tmpl.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => applyTemplate(tmpl.id)}
                className="glass-card p-5 space-y-4 cursor-pointer hover:border-purple-400/50 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className={`h-1.5 w-full rounded-full bg-gradient-to-r ${tmpl.coverGradient} absolute top-0 left-0`} />
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {tmpl.category}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-purple-300 transition-colors">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {tmpl.description}
                  </p>
                </div>

                <button className="glass-button-primary text-xs w-full justify-center mt-2 group-hover:bg-purple-600 transition-colors">
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Minimal Onboarding Cards: Activity, Calendar & Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Empty Activity State */}
          <div className="glass-card p-6 space-y-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-200">Recent Workspace Activity</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Your workspace stream will populate automatically as you create tasks, move columns, and invite collaborators.
              </p>
            </div>
          </div>

          {/* Empty Calendar State */}
          <div className="glass-card p-6 space-y-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-200">Upcoming Calendar Deadlines</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                No scheduled deadlines. Assign due dates to your project tasks to view them on the interactive calendar.
              </p>
            </div>
          </div>

          {/* Minimized Analytics Teaser */}
          <div className="glass-card p-6 space-y-4 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-200">Analytics & Velocity Insights</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Burndown charts, team velocity, and task completion metrics will activate once your first project is underway.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // ACTIVE WORKSPACE MODE (1+ PROJECTS CREATED)
  // ----------------------------------------------------
  const favoriteProjects = projects.filter((p) => p.favorite).length;
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in_progress').length;
  const urgentTasks = filteredTasks.filter((t) => t.priority === 'urgent' || t.priority === 'critical').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const chartData = [
    { day: 'Mon', completed: Math.max(1, completedTasks - 4), created: 5 },
    { day: 'Tue', completed: Math.max(2, completedTasks - 3), created: 4 },
    { day: 'Wed', completed: Math.max(3, completedTasks - 2), created: 6 },
    { day: 'Thu', completed: Math.max(4, completedTasks - 1), created: 5 },
    { day: 'Fri', completed: completedTasks, created: 3 }
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 overflow-y-auto space-y-6">
      {/* Active Workspace Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 lg:p-8 bg-gradient-to-r from-purple-900/40 via-slate-900/80 to-cyan-900/40 border-purple-500/30 flex flex-wrap items-center justify-between gap-6"
      >
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Dashboard Overview
            </span>
            <span className="text-xs text-slate-400 font-mono">{todayFormatted}</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight">
            {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400">{user?.name || 'Workspace Owner'}</span> 👋
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Your workspace is active. You have {urgentTasks} urgent tasks requiring attention across {totalProjects} project{totalProjects > 1 ? 's' : ''}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateProjectOpen(true)}
            className="glass-button-primary text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className="glass-button-secondary text-xs"
          >
            <Kanban className="w-4 h-4 text-cyan-400" />
            <span>Open Kanban Board</span>
          </button>
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="glass-button-secondary text-xs"
          >
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>AI Health</span>
          </button>
        </div>
      </motion.div>

      {/* Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Projects */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onClick={() => setViewMode('projects')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-purple-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Projects</span>
            <FolderKanban className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{totalProjects}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          </div>
        </motion.div>

        {/* Favorite Projects */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setViewMode('projects')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-amber-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Favorite Projects</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{favoriteProjects}</span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
              Starred
            </span>
          </div>
        </motion.div>

        {/* Total Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setViewMode('kanban')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-cyan-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Tasks</span>
            <Kanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{totalTasks}</span>
            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              In Scope
            </span>
          </div>
        </motion.div>

        {/* In Progress Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setViewMode('kanban')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-indigo-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">In Progress</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{inProgressTasks}</span>
            <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">
              Active
            </span>
          </div>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onClick={() => setViewMode('kanban')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-emerald-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Completed Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{completedTasks}</span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              {completionRate}% Done
            </span>
          </div>
        </motion.div>

        {/* Urgent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={() => setViewMode('kanban')}
          className="glass-card p-4 space-y-2 cursor-pointer hover:border-rose-400/50"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Urgent Priority</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-100">{urgentTasks}</span>
            <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
              Immediate
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Workspace Section: Velocity Chart & Projects Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-6 lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span>Sprint Velocity Trend</span>
              </h3>
              <p className="text-xs text-slate-400">Completed vs created tasks this week</p>
            </div>
            <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              Live Metrics
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  }}
                />
                <Area type="monotone" dataKey="completed" name="Completed Tasks" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#completedGrad)" />
                <Area type="monotone" dataKey="created" name="Created Tasks" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#createdGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Projects Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
              <span>Active Projects</span>
            </h3>
            <button
              onClick={() => setViewMode('projects')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setCurrentProject(proj);
                  setViewMode('kanban');
                }}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-400/50 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200 hover:text-purple-300 transition-colors truncate">
                    {proj.name}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-1.5 py-0.5 rounded border border-purple-500/30">
                    {proj.key}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress || 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
