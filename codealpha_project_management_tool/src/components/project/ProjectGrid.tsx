import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../types';
import { 
  Search, 
  Plus, 
  Grid, 
  List as ListIcon, 
  FolderX, 
  Star, 
  Archive,
  Layers
} from 'lucide-react';

interface ProjectGridProps {
  onOpenCreate: () => void;
  onEditProject: (project: Project) => void;
  onViewDetails: (project: Project) => void;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  onOpenCreate,
  onEditProject,
  onViewDetails,
}) => {
  const { projects } = useApp();

  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'active' | 'archived' | 'private' | 'high_priority'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'progress' | 'dueDate'>('recent');

  // Filter Logic
  const filteredProjects = projects.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const nameMatch = p.name.toLowerCase().includes(q);
      const descMatch = p.description.toLowerCase().includes(q);
      const catMatch = p.category?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch && !catMatch) return false;
    }

    if (activeFilter === 'favorites' && !p.favorite) return false;
    if (activeFilter === 'archived' && !p.archived) return false;
    if (activeFilter === 'active' && (p.archived || p.status === 'completed')) return false;
    if (activeFilter === 'private' && p.visibility !== 'private') return false;
    if (activeFilter === 'high_priority' && p.priority !== 'high' && p.priority !== 'urgent') return false;

    return true;
  });

  // Sort Logic
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'progress') return b.progress - a.progress;
    if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
    return b.id.localeCompare(a.id);
  });

  const filterChips: { id: typeof activeFilter; label: string; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'favorites', label: 'Favorites', icon: <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> },
    { id: 'active', label: 'Active Sprints' },
    { id: 'archived', label: 'Archived', icon: <Archive className="w-3 h-3" /> },
    { id: 'private', label: 'Private Only' },
    { id: 'high_priority', label: 'High Priority' },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 flex flex-col h-full overflow-y-auto space-y-6">
      {/* Top Header Bar */}
      <div className="glass-panel p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-100 tracking-tight">Project Management Directory</h2>
            <p className="text-xs text-slate-400">Manage, organize & collaborate across active software sprints</p>
          </div>
        </div>

        <button
          onClick={onOpenCreate}
          className="glass-button-primary text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="glass-input pl-9 w-full text-xs"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {filterChips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveFilter(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === chip.id
                  ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                  : 'bg-white/5 border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
              }`}
            >
              {chip.icon}
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Sort Selector */}
        <div className="flex items-center gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="glass-input text-xs font-semibold text-slate-300"
          >
            <option value="recent" className="bg-slate-900">Recently Created</option>
            <option value="name" className="bg-slate-900">Alphabetical</option>
            <option value="progress" className="bg-slate-900">Completion %</option>
            <option value="dueDate" className="bg-slate-900">Due Date</option>
          </select>

          <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'grid' ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                layout === 'list' ? 'bg-purple-500/30 text-purple-200' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid / List Output */}
      {sortedProjects.length > 0 ? (
        <div
          className={
            layout === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {sortedProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onEdit={onEditProject}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        /* Empty State Illustration */
        <div className="glass-panel p-12 flex flex-col items-center justify-center text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-xl">
            <FolderX className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-100">No Projects Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No matching results for "${searchQuery}". Try adjusting your filters.`
                : 'No projects created in this view yet. Start by creating a project.'}
            </p>
          </div>
          <button onClick={onOpenCreate} className="glass-button-primary text-xs">
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      )}
    </div>
  );
};
