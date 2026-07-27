import React, { useState } from 'react';
import type { Project } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Cpu, 
  Smartphone, 
  Layers, 
  TrendingUp, 
  Star, 
  MoreHorizontal, 
  Calendar, 
  Archive, 
  Copy, 
  Edit3, 
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onViewDetails?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onViewDetails,
}) => {
  const { 
    setCurrentProject, 
    setViewMode, 
    toggleFavoriteProject, 
    archiveProject, 
    duplicateProject, 
    deleteProject 
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-cyan-400" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5 text-pink-400" />;
      case 'Layers': return <Layers className="w-5 h-5 text-purple-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      default: return <Sparkles className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleCardClick = () => {
    setCurrentProject(project);
    if (onViewDetails) {
      onViewDetails(project);
    } else {
      setViewMode('project_details');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className="glass-card group cursor-pointer overflow-hidden flex flex-col justify-between p-5 space-y-4 border border-white/10 hover:border-purple-400/50 relative"
    >
      {/* Top Cover Gradient Strip */}
      <div className={`h-2.5 -mx-5 -mt-5 mb-1 bg-gradient-to-r ${project.coverGradient || 'from-purple-600 to-indigo-600'}`} />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
            {getIcon(project.icon)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-100 group-hover:text-purple-300 transition-colors truncate max-w-[180px]">
                {project.name}
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800/80 text-slate-400 border border-white/5">
                {project.key}
              </span>
            </div>
            <p className="text-[11px] text-purple-300 font-medium">{project.category}</p>
          </div>
        </div>

        {/* Favorite & Options Dropdown */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleFavoriteProject(project.id)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title={project.favorite ? 'Unfavorite' : 'Mark Favorite'}
          >
            <Star className={`w-4 h-4 ${project.favorite ? 'text-amber-400 fill-amber-400' : 'text-slate-500 hover:text-amber-300'}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute right-0 mt-1 w-44 glass-panel p-1.5 z-30 shadow-2xl border border-white/15 space-y-0.5 text-xs"
                >
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(project);
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Project</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      duplicateProject(project.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Duplicate</span>
                  </button>

                  <button
                    onClick={() => {
                      archiveProject(project.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-slate-200"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-400" />
                    <span>{project.archived ? 'Restore' : 'Archive'}</span>
                  </button>

                  <button
                    onClick={() => {
                      deleteProject(project.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-rose-500/20 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {project.description || 'No description provided for this project.'}
      </p>

      {/* Progress Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <span>Overall Progress</span>
          <span className="font-mono text-purple-300">{project.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Due {project.dueDate}</span>
        </div>

        {/* Member Avatars */}
        <div className="flex items-center -space-x-1.5">
          {project.members.slice(0, 3).map((usr) => (
            <img
              key={usr.id}
              src={usr.avatar}
              alt={usr.name}
              title={usr.name}
              className="w-6 h-6 rounded-full border border-slate-900 object-cover"
            />
          ))}
          {project.members.length > 3 && (
            <span className="w-6 h-6 rounded-full bg-white/10 border border-slate-900 flex items-center justify-center text-[9px] font-bold text-slate-300">
              +{project.members.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
