import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Project } from '../types';
import { 
  Sparkles, 
  ArrowLeft, 
  Users, 
  Kanban, 
  GanttChartSquare, 
  Calendar as CalendarIcon, 
  FileText, 
  Activity, 
  UserPlus, 
  ChevronRight
} from 'lucide-react';

interface ProjectDetailsPageProps {
  project?: Project;
  onBack: () => void;
}

export const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ project: propProject, onBack }) => {
  const { currentProject, setViewMode } = useApp();
  const project = propProject || currentProject;

  const [activeTab, setActiveTab] = useState<'overview' | 'kanban' | 'timeline' | 'calendar' | 'files'>('overview');

  const activityTimeline = [
    { id: 'act-1', user: 'Sarah Chen', action: 'created project', target: project.name, timestamp: '1 day ago' },
    { id: 'act-2', user: 'Alex Rivera', action: 'joined workspace', target: 'Full-Stack Engineer', timestamp: '12 hours ago' },
    { id: 'act-3', user: 'Elena Rostova', action: 'updated milestone', target: 'Sprint 24 Architecture', timestamp: '3 hours ago' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects Directory</span>
      </button>

      {/* Cover Header Banner */}
      <div className="glass-panel overflow-hidden border border-white/15 relative">
        <div className={`h-28 w-full bg-gradient-to-r ${project.coverGradient || 'from-purple-600 to-indigo-600'}`} />

        <div className="p-6 relative -mt-10 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-white/20 flex items-center justify-center shadow-2xl">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-100">{project.name}</h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-white/10">
                  {project.key}
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {project.category}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('kanban')}
              className="glass-button-primary text-xs"
            >
              <Kanban className="w-4 h-4" />
              <span>Open Sprint Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-white/10 text-sm font-semibold">
        {[
          { id: 'overview', label: 'Project Overview', icon: <FileText className="w-4 h-4" /> },
          { id: 'kanban', label: 'Kanban Board (Sprint 3)', icon: <Kanban className="w-4 h-4" /> },
          { id: 'timeline', label: 'Timeline / Gantt (Sprint 3)', icon: <GanttChartSquare className="w-4 h-4" /> },
          { id: 'calendar', label: 'Calendar (Sprint 3)', icon: <CalendarIcon className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`py-3 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scope & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* 3 Quick Stat Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Progress</span>
                <p className="text-2xl font-extrabold font-mono text-purple-300">{project.progress}%</p>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="glass-panel p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Due Date</span>
                <p className="text-xl font-bold font-mono text-slate-200 mt-1">{project.dueDate}</p>
                <span className="text-[10px] text-slate-400">Scheduled Release</span>
              </div>

              <div className="glass-panel p-4 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Team Scope</span>
                <p className="text-2xl font-extrabold font-mono text-cyan-300">{project.members.length} Members</p>
                <span className="text-[10px] text-slate-400">Active Contributors</span>
              </div>
            </div>

            {/* Audit Activity Timeline */}
            <div className="glass-panel p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Activity Audit Log</span>
              </h3>

              <div className="space-y-3">
                {activityTimeline.map((act) => (
                  <div key={act.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="font-semibold text-slate-200">{act.user}</span>
                      <span className="text-slate-400">{act.action}</span>
                      <span className="font-bold text-purple-300">{act.target}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar: Members */}
          <div className="space-y-6">
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Project Contributors</span>
                </h3>
                <button className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300">
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {project.members.map((usr) => (
                  <div key={usr.id} className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img src={usr.avatar} alt={usr.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <h5 className="font-semibold text-slate-200">{usr.name}</h5>
                        <p className="text-[10px] text-slate-400">{usr.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                      {usr.role || 'Member'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sprint 3 Placeholder Message */}
      {activeTab !== 'overview' && (
        <div className="glass-panel p-12 text-center space-y-4 my-6">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
            <Kanban className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-100">Full {activeTab.toUpperCase()} View Arriving in Sprint 3</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Sprint 3 will connect complete Kanban drag-and-drop task management, Gantt dependency timelines, and file asset uploading to this project view.
          </p>
          <button onClick={() => setViewMode('kanban')} className="glass-button-primary text-xs">
            <span>Launch Kanban Demo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
