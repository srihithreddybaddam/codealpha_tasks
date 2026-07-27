import React from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { DashboardView } from '../dashboard/DashboardView';
import { ProjectGrid } from '../project/ProjectGrid';
import { CreateProjectModal } from '../project/CreateProjectModal';
import { ProjectDetailsPage } from '../../pages/ProjectDetailsPage';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { ListView } from '../list/ListView';
import { CalendarView } from '../calendar/CalendarView';
import { TimelineView } from '../gantt/TimelineView';
import { AnalyticsView } from '../analytics/AnalyticsView';
import { TeamView } from '../team/TeamView';
import { SettingsView } from '../settings/SettingsView';
import { DiscussionsPage } from '../../pages/DiscussionsPage';
import { FilesHubPage } from '../../pages/FilesHubPage';
import { HelpCenterPage } from '../../pages/HelpCenterPage';
import { TaskDetailModal } from '../task/TaskDetailModal';
import { AIAssistantModal } from '../ai/AIAssistantModal';
import { CmdKModal } from '../common/CmdKModal';
import { NewTaskModal } from '../common/NewTaskModal';
import { TimeTrackerWidget } from '../common/TimeTrackerWidget';
import type { Project } from '../../types';

export const MainLayout: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    isCreateProjectOpen, 
    setIsCreateProjectOpen, 
    editingProject, 
    setEditingProject,
    setCurrentProject 
  } = useApp();

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsCreateProjectOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    setCurrentProject(project);
    setViewMode('project_details');
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'dashboard': return <DashboardView />;
      case 'projects': 
        return (
          <ProjectGrid
            onOpenCreate={() => setIsCreateProjectOpen(true)}
            onEditProject={handleEditProject}
            onViewDetails={handleViewDetails}
          />
        );
      case 'project_details': 
        return (
          <ProjectDetailsPage
            onBack={() => setViewMode('projects')}
          />
        );
      case 'kanban': return <KanbanBoard />;
      case 'list': return <ListView />;
      case 'calendar': return <CalendarView />;
      case 'gantt': return <TimelineView />;
      case 'analytics': return <AnalyticsView />;
      case 'team': return <TeamView />;
      case 'discussions': return <DiscussionsPage />;
      case 'files': return <FilesHubPage />;
      case 'help': return <HelpCenterPage />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-100">
      {/* Background Ambient Mesh Glass Blobs */}
      <div className="bg-ambient-blob-1" />
      <div className="bg-ambient-blob-2" />
      <div className="bg-ambient-blob-3" />

      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace Container */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Glass Modals & Widgets */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => {
          setIsCreateProjectOpen(false);
          setEditingProject(null);
        }}
        editProject={editingProject}
      />
      <TaskDetailModal />
      <AIAssistantModal />
      <CmdKModal />
      <NewTaskModal />
      <TimeTrackerWidget />
    </div>
  );
};
