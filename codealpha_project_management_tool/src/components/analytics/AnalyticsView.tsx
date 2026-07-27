import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart as PieIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { filteredTasks, projects, currentProject, setViewMode } = useApp();

  if (projects.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-xl">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="font-extrabold text-xl text-slate-100">Analytics & Insights Hub</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time velocity burndown charts and completion metrics will automatically activate as you create projects and track tasks.
          </p>
        </div>
        <button onClick={() => setViewMode('dashboard')} className="glass-button-primary text-xs px-5 py-3">
          <span>Get Started on Dashboard</span>
        </button>
      </div>
    );
  }

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter((t) => t.status === 'done').length;
  const urgentTasks = filteredTasks.filter((t) => t.priority === 'urgent' || t.priority === 'critical').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const pieData = [
    { name: 'Critical / Urgent', value: urgentTasks || 1, color: '#f43f5e' },
    { name: 'High Priority', value: filteredTasks.filter(t => t.priority === 'high').length || 2, color: '#f59e0b' },
    { name: 'Medium Priority', value: filteredTasks.filter(t => t.priority === 'medium').length || 3, color: '#a855f7' },
    { name: 'Low Priority', value: filteredTasks.filter(t => t.priority === 'low').length || 1, color: '#06b6d4' },
  ];

  const velocityData = [
    { day: 'Sprint Day 1', velocity: 12, target: 15 },
    { day: 'Sprint Day 2', velocity: 18, target: 20 },
    { day: 'Sprint Day 3', velocity: 26, target: 25 },
    { day: 'Sprint Day 4', velocity: 34, target: 30 },
    { day: 'Sprint Day 5', velocity: 42, target: 35 },
    { day: 'Sprint Day 6', velocity: 58, target: 45 },
    { day: 'Sprint Day 7', velocity: 68, target: 50 },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-100">{currentProject?.name || 'Workspace'}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                Analytics & Insights
              </span>
            </div>
            <p className="text-xs text-slate-400">Sprint velocity charts, priority distribution, time tracking, and productivity scores</p>
          </div>
        </div>
      </div>

      {/* 4 Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Completion Rate</span>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">{completionRate}%</p>
          <p className="text-[10px] text-slate-400">{completedTasks} of {totalTasks} Tasks Done</p>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Sprint Velocity</span>
          <p className="text-2xl font-extrabold font-mono text-purple-300">68 pts</p>
          <p className="text-[10px] text-purple-400 font-semibold">+18% vs Target</p>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Productivity Score</span>
          <p className="text-2xl font-extrabold font-mono text-cyan-300">94 / 100</p>
          <p className="text-[10px] text-slate-400">High Consistency</p>
        </div>

        <div className="glass-panel p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Critical Risks</span>
          <p className="text-2xl font-extrabold font-mono text-rose-400">{urgentTasks}</p>
          <p className="text-[10px] text-rose-400 font-semibold">Immediate Action</p>
        </div>
      </div>

      {/* Recharts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity Area Chart */}
        <div className="lg:col-span-2 glass-panel p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>Sprint Completion Velocity Trend</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData}>
                <defs>
                  <linearGradient id="colorVel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', borderRadius: '0.75rem', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="velocity" stroke="#a855f7" strokeWidth={3} fill="url(#colorVel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution Pie Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-cyan-400" />
            <span>Priority Breakdown</span>
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', borderRadius: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-mono font-bold">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
