import React, { useState } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useApp } from '../../context/AppContext';
import { TaskCard } from './TaskCard';
import type { TaskStatus, Priority } from '../../types';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  MoreHorizontal, 
  Trash2, 
  ChevronLeft,
  FolderKanban,
  Sparkles,
  Kanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const KanbanBoard: React.FC = () => {
  const { 
    currentProject, 
    projects,
    setIsCreateProjectOpen,
    filteredTasks, 
    moveTaskStatus, 
    setIsNewTaskOpen,
    createColumn,
    renameColumn,
    deleteColumn,
    collapseColumn,
    filterState,
    setFilterState,
    setViewMode
  } = useApp();

  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');
  const [editingColId, setEditingColId] = useState<TaskStatus | null>(null);
  const [colMenuOpenId, setColMenuOpenId] = useState<TaskStatus | null>(null);

  const columns = currentProject?.columns || [
    { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
    { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10', wipLimit: 6 },
    { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10', wipLimit: 4 },
    { id: 'in_review', title: 'In Review', color: '#f59e0b', accentGradient: 'from-amber-500/20 to-orange-600/10', wipLimit: 3 },
    { id: 'testing', title: 'QA Testing', color: '#ec4899', accentGradient: 'from-pink-500/20 to-rose-600/10' },
    { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
  ];

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const destStatus = destination.droppableId as TaskStatus;
    moveTaskStatus(draggableId, destStatus);
  };

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    createColumn(newColTitle.trim());
    setNewColTitle('');
    setIsAddColumnOpen(false);
  };

  const priorityChips: { id: Priority | 'all'; label: string }[] = [
    { id: 'all', label: 'All Priorities' },
    { id: 'critical', label: 'Critical' },
    { id: 'urgent', label: 'Urgent' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  if (projects.length === 0) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-xl">
          <Kanban className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="font-extrabold text-xl text-slate-100">No Active Kanban Board</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create your first project or select a ready-to-use template to initialize interactive drag & drop columns.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCreateProjectOpen(true)} className="glass-button-primary text-xs px-5 py-3">
            <Plus className="w-4 h-4" />
            <span>Create Project</span>
          </button>
          <button onClick={() => setViewMode('dashboard')} className="glass-button-secondary text-xs px-5 py-3">
            <span>Explore Templates</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 lg:p-8 space-y-6">
      {/* Project Workspace Header Banner */}
      <div className="glass-panel p-6 border border-white/15 relative overflow-hidden space-y-4">
        {/* Top Cover Gradient Accent */}
        <div className={`h-2 -mx-6 -mt-6 mb-2 bg-gradient-to-r ${currentProject?.coverGradient || 'from-purple-600 to-indigo-600'}`} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('projects')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              title="Return to Projects Directory"
            >
              <FolderKanban className="w-5 h-5 text-purple-400" />
            </button>

            <div>
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>Projects</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-purple-300 font-semibold">{currentProject?.name || 'Workspace'}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold ml-1">
                  {currentProject?.key || 'WS'}
                </span>
              </div>
              <h1 className="text-xl font-extrabold text-slate-100 tracking-tight mt-0.5">
                Interactive Sprint Kanban Board
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="glass-button-primary text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
            <button
              onClick={() => setIsAddColumnOpen(true)}
              className="glass-button-secondary text-xs"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Add Column</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          {/* Instant Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filterState.searchQuery}
              onChange={(e) => setFilterState((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="glass-input pl-9 w-full text-xs"
            />
          </div>

          {/* Priority Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {priorityChips.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterState((prev) => ({ ...prev, priority: chip.id }))}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  filterState.priority === chip.id
                    ? 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <select
            value={filterState.sort}
            onChange={(e) => setFilterState((prev) => ({ ...prev, sort: e.target.value as typeof filterState.sort }))}
            className="glass-input text-xs font-semibold text-slate-300"
          >
            <option value="recent" className="bg-slate-900">Newest First</option>
            <option value="priority" className="bg-slate-900">Priority (Critical First)</option>
            <option value="dueDate" className="bg-slate-900">Due Date</option>
            <option value="progress" className="bg-slate-900">Progress %</option>
          </select>
        </div>
      </div>

      {/* Drag & Drop Kanban Columns */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start scrollbar-thin">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            const isCollapsed = column.collapsed;

            return (
              <div
                key={column.id}
                className={`glass-panel p-3 flex flex-col max-h-full transition-all duration-300 border border-white/10 ${
                  isCollapsed ? 'w-16 min-w-[64px]' : 'w-80 min-w-[320px]'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                  {!isCollapsed ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color || '#a855f7' }} />
                      
                      {editingColId === column.id ? (
                        <input
                          type="text"
                          defaultValue={column.title}
                          onBlur={(e) => {
                            renameColumn(column.id, e.target.value);
                            setEditingColId(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              renameColumn(column.id, e.currentTarget.value);
                              setEditingColId(null);
                            }
                          }}
                          autoFocus
                          className="glass-input px-2 py-0.5 text-xs font-bold w-32"
                        />
                      ) : (
                        <h3
                          onClick={() => setEditingColId(column.id)}
                          className="font-extrabold text-xs text-slate-100 uppercase tracking-wider cursor-pointer hover:text-purple-300 transition-colors"
                        >
                          {column.title}
                        </h3>
                      )}

                      <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold rounded-full bg-white/10 text-slate-300">
                        {columnTasks.length}
                      </span>
                    </div>
                  ) : (
                    <span className="font-extrabold text-[10px] uppercase rotate-90 text-slate-400 mx-auto">
                      {column.title}
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => collapseColumn(column.id)}
                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                      title={isCollapsed ? 'Expand Column' : 'Collapse Column'}
                    >
                      {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
                    </button>

                    {!isCollapsed && (
                      <div className="relative">
                        <button
                          onClick={() => setColMenuOpenId(colMenuOpenId === column.id ? null : column.id)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        <AnimatePresence>
                          {colMenuOpenId === column.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 5 }}
                              className="absolute right-0 mt-1 w-36 glass-panel p-1.5 z-30 shadow-2xl border border-white/15 text-xs"
                            >
                              <button
                                onClick={() => {
                                  deleteColumn(column.id);
                                  setColMenuOpenId(null);
                                }}
                                className="w-full flex items-center gap-2 p-1.5 rounded hover:bg-rose-500/20 text-rose-300"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                                <span>Delete Column</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                {/* Droppable Task List Container */}
                {!isCollapsed && (
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto pr-1 space-y-3 min-h-[150px] transition-colors rounded-xl p-1 ${
                          snapshot.isDraggingOver ? 'bg-purple-500/10 border border-purple-500/20' : ''
                        }`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(providedDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                              >
                                <TaskCard task={task} index={index} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {columnTasks.length === 0 && (
                          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-white/10 rounded-xl space-y-1">
                            <Sparkles className="w-5 h-5 mx-auto text-slate-600" />
                            <p>No tasks in {column.title}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Add Custom Column Modal */}
      {isAddColumnOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <form onSubmit={handleCreateColumn} className="glass-modal w-full max-w-sm p-6 space-y-4 border border-white/20">
            <h3 className="font-bold text-base text-slate-100">Add New Kanban Column</h3>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Column Title</label>
              <input
                type="text"
                required
                placeholder="Enter column title"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                className="glass-input w-full text-xs font-semibold"
                autoFocus
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddColumnOpen(false)}
                className="glass-button-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button-primary text-xs"
              >
                Add Column
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
