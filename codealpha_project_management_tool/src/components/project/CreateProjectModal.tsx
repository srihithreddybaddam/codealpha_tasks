import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { PROJECT_TEMPLATES } from '../../utils/workspaceGenerator';
import type { ProjectTemplate } from '../../utils/workspaceGenerator';
import type { Project, Priority, AccentColor } from '../../types';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProject?: Project | null;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  editProject,
}) => {
  const { createProject, updateProject, applyTemplate, users } = useApp();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Development');
  const [visibility, setVisibility] = useState<'private' | 'team' | 'public'>('team');
  const [priority, setPriority] = useState<Priority>('medium');
  const [accentColor, setAccentColor] = useState<AccentColor>('purple');
  const [coverGradient, setCoverGradient] = useState('from-purple-600/50 via-indigo-600/40 to-pink-600/50');
  const [dueDate, setDueDate] = useState('2026-09-01');
  const [favorite, setFavorite] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null);

  const gradientPresets = [
    { label: 'Violet Nebula', value: 'from-purple-600/50 via-indigo-600/40 to-pink-600/50' },
    { label: 'Cyan Cyber', value: 'from-cyan-600/50 via-blue-600/40 to-emerald-600/50' },
    { label: 'Rose Sunset', value: 'from-pink-600/50 via-rose-600/40 to-amber-600/50' },
    { label: 'Emerald Mint', value: 'from-emerald-600/50 via-teal-600/40 to-cyan-600/50' },
    { label: 'Amber Solar', value: 'from-amber-600/50 via-orange-600/40 to-rose-600/50' },
  ];

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setKey(editProject.key);
      setDescription(editProject.description);
      setCategory(editProject.category || 'Software Development');
      setVisibility(editProject.visibility || 'team');
      setPriority(editProject.priority || 'medium');
      setAccentColor(editProject.accentColor || 'purple');
      setCoverGradient(editProject.coverGradient || gradientPresets[0].value);
      setDueDate(editProject.dueDate || '2026-09-01');
      setFavorite(editProject.favorite || false);
      setSelectedTemplate(null);
    } else {
      setName('');
      setKey('');
      setDescription('');
      setSelectedTemplate(null);
    }
  }, [editProject, isOpen]);

  if (!isOpen) return null;

  const handleApplyTemplateSelect = (tmpl: ProjectTemplate) => {
    if (selectedTemplate?.id === tmpl.id) {
      setSelectedTemplate(null);
      setName('');
      setKey('');
      setDescription('');
    } else {
      setSelectedTemplate(tmpl);
      setName(tmpl.name);
      setKey(tmpl.id.slice(0, 4).toUpperCase());
      setDescription(tmpl.description);
      setCategory(tmpl.category);
      setCoverGradient(tmpl.coverGradient);
      setAccentColor(tmpl.accentColor);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!editProject && selectedTemplate) {
      applyTemplate(selectedTemplate.id, name.trim());
      onClose();
      return;
    }

    const projectData: Partial<Project> = {
      name: name.trim(),
      key: (key || name.slice(0, 3)).toUpperCase(),
      description,
      category,
      visibility,
      priority,
      accentColor,
      coverGradient,
      dueDate,
      favorite,
      owner: users[0]?.name || 'Workspace Owner',
      members: users.length > 0 ? [users[0]] : [],
      columns: [
        { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
        { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
        { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
        { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
      ]
    };

    if (editProject) {
      updateProject(editProject.id, projectData);
    } else {
      createProject(projectData);
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-modal w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative border border-white/20 shadow-2xl"
        >
          {/* Cover Strip Preview */}
          <div className={`h-4 w-full bg-gradient-to-r ${coverGradient}`} />

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>{editProject ? 'Edit Project Settings' : 'Create New Project'}</span>
              </h3>
              <p className="text-xs text-slate-400">Configure workspace, starter template, and cover gradient</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
            {/* Starter Templates Picker */}
            {!editProject && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select a Template (Optional)
                  </label>
                  {selectedTemplate && (
                    <span className="text-[10px] text-purple-300 font-mono">
                      Template: {selectedTemplate.name}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROJECT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyTemplateSelect(tmpl)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedTemplate?.id === tmpl.id
                          ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-md shadow-purple-500/20'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/30'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{tmpl.name}</span>
                        {selectedTemplate?.id === tmpl.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 line-clamp-1 block mt-0.5">{tmpl.category}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter project name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input w-full text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Key (Short Tag)</label>
                <input
                  type="text"
                  placeholder="Enter project key"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="glass-input w-full text-xs uppercase font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                rows={2}
                placeholder="Briefly describe your project"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input w-full text-xs resize-none"
              />
            </div>

            {/* Aesthetics Selection */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Cover Gradient Theme</label>
              <div className="grid grid-cols-5 gap-2">
                {gradientPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setCoverGradient(preset.value)}
                    className={`h-9 rounded-xl bg-gradient-to-r ${preset.value} border transition-all ${
                      coverGradient === preset.value ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="glass-button-secondary text-xs px-5 py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary text-xs px-6 py-2.5 shadow-lg shadow-purple-500/30"
              >
                <Plus className="w-4 h-4" />
                <span>{editProject ? 'Save Changes' : selectedTemplate ? 'Create From Template' : 'Create Blank Project'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
