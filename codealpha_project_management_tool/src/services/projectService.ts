import type { Project } from '../types';
import { mockProjects } from '../data/mockData';

const API_BASE_URL = 'http://localhost:5000/api/projects';

export class ProjectService {
  static async getProjects(token?: string): Promise<{ success: boolean; projects: Project[] }> {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (data.success && data.projects) {
        return data;
      }
      return { success: true, projects: mockProjects };
    } catch {
      return { success: true, projects: mockProjects };
    }
  }

  static async createProject(projectData: Partial<Project>, token?: string): Promise<{ success: boolean; project?: Project }> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(projectData),
      });
      return await response.json();
    } catch {
      const newProj: Project = {
        id: `prj-${Date.now()}`,
        name: projectData.name || 'Untitled Project',
        key: projectData.key || 'PRJ',
        description: projectData.description || '',
        owner: projectData.owner || 'Sarah Chen',
        accentColor: projectData.accentColor || 'purple',
        coverGradient: projectData.coverGradient || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
        icon: projectData.icon || 'Sparkles',
        members: projectData.members || [],
        columns: [
          { id: 'backlog', title: 'Backlog', color: '#94a3b8', accentGradient: 'from-slate-500/20 to-slate-600/10' },
          { id: 'todo', title: 'To Do', color: '#38bdf8', accentGradient: 'from-sky-500/20 to-blue-600/10' },
          { id: 'in_progress', title: 'In Progress', color: '#a855f7', accentGradient: 'from-purple-500/20 to-indigo-600/10' },
          { id: 'done', title: 'Completed', color: '#10b981', accentGradient: 'from-emerald-500/20 to-teal-600/10' }
        ],
        priority: projectData.priority || 'medium',
        category: projectData.category || 'Software Development',
        visibility: projectData.visibility || 'team',
        status: 'active',
        favorite: false,
        archived: false,
        pinned: false,
        dueDate: projectData.dueDate || '2026-09-01',
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, project: newProj };
    }
  }

  static async updateProject(id: string, updates: Partial<Project>, token?: string): Promise<{ success: boolean; project?: Project }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updates),
      });
      return await response.json();
    } catch {
      return { success: true };
    }
  }

  static async deleteProject(id: string, token?: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return await response.json();
    } catch {
      return { success: true };
    }
  }

  static async toggleFavorite(id: string, token?: string): Promise<{ success: boolean; favorite?: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/favorite`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return await response.json();
    } catch {
      return { success: true };
    }
  }

  static async archiveProject(id: string, token?: string): Promise<{ success: boolean; archived?: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/archive`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      return await response.json();
    } catch {
      return { success: true };
    }
  }
}
