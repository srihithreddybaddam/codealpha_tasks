import type { Task } from '../types';
import { mockTasks } from '../data/mockData';

const API_BASE_URL = 'http://localhost:5000/api/tasks';

export class TaskService {
  static async getTasks(projectId?: string, token?: string): Promise<{ success: boolean; tasks: Task[] }> {
    try {
      const url = projectId ? `${API_BASE_URL}?projectId=${projectId}` : API_BASE_URL;
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (data.success && data.tasks) {
        return data;
      }
      return { success: true, tasks: mockTasks };
    } catch {
      return { success: true, tasks: mockTasks };
    }
  }

  static async createTask(taskData: Partial<Task>, token?: string): Promise<{ success: boolean; task?: Task }> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(taskData),
      });
      return await response.json();
    } catch {
      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        projectId: taskData.projectId || 'prj-1',
        title: taskData.title || 'Untitled Task',
        description: taskData.description || '',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        dueDate: taskData.dueDate || '2026-08-30',
        startDate: taskData.startDate || '2026-08-01',
        coverColor: taskData.coverColor || 'from-purple-600/50 via-indigo-600/40 to-pink-600/50',
        assignees: taskData.assignees || [],
        labels: taskData.labels || ['Feature'],
        checklist: [],
        subtasks: [],
        attachments: [],
        comments: [],
        activities: [],
        estimatedHours: taskData.estimatedHours || 8,
        loggedHours: 0,
        progress: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return { success: true, task: newTask };
    }
  }

  static async updateTask(id: string, updates: Partial<Task>, token?: string): Promise<{ success: boolean; task?: Task }> {
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

  static async moveTask(id: string, status: string, token?: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch {
      return { success: true };
    }
  }

  static async deleteTask(id: string, token?: string): Promise<{ success: boolean }> {
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
}
