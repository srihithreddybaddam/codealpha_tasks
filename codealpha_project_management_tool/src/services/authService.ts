import type { User } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/auth';
const REGISTERED_USERS_KEY = 'aether_registered_users';

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export class AuthService {
  // Helper to retrieve local registered accounts
  private static getStoredUsers(): (User & { passwordHash: string })[] {
    try {
      const data = localStorage.getItem(REGISTERED_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private static saveStoredUsers(users: (User & { passwordHash: string })[]): void {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  }

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) return data;
    } catch {
      // API Offline - Local Auth Fallback
    }

    const cleanEmail = email.trim().toLowerCase();
    const storedUsers = this.getStoredUsers();
    const matchingUser = storedUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === password
    );

    if (matchingUser) {
      const { passwordHash, ...userObj } = matchingUser;
      return {
        success: true,
        token: `token-aether-${userObj.id}-${Date.now()}`,
        user: userObj
      };
    }

    return {
      success: false,
      message: 'Invalid email or password. Please register an account or check your credentials.'
    };
  }

  static async register(
    name: string, 
    email: string, 
    password: string, 
    role?: string, 
    avatar?: string
  ): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, avatar }),
      });
      const data = await response.json();
      if (data.success) return data;
    } catch {
      // API Offline - Local Auth Fallback
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const storedUsers = this.getStoredUsers();

    // Check duplicate email
    const existing = storedUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      };
    }

    // Create new registered user
    const newUser: User & { passwordHash: string } = {
      id: `usr-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=8b5cf6&color=ffffff&bold=true`,
      role: role || 'Workspace Owner',
      status: 'online',
      passwordHash: password
    };

    storedUsers.push(newUser);
    this.saveStoredUsers(storedUsers);

    const { passwordHash, ...userObj } = newUser;
    return {
      success: true,
      token: `token-aether-${userObj.id}-${Date.now()}`,
      user: userObj
    };
  }

  static async getMe(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } catch {
      const storedUserStr = localStorage.getItem('aether_user') || sessionStorage.getItem('aether_user');
      if (storedUserStr) {
        return { success: true, user: JSON.parse(storedUserStr) };
      }
      return { success: false, message: 'Session expired' };
    }
  }
}
