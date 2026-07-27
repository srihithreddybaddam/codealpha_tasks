import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role?: string, avatar?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('aether_token') || sessionStorage.getItem('aether_token');
    const storedUser = localStorage.getItem('aether_user') || sessionStorage.getItem('aether_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('aether_token');
        localStorage.removeItem('aether_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean = true) => {
    setIsLoading(true);
    try {
      const res = await AuthService.login(email, password);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('aether_token', res.token);
        storage.setItem('aether_user', JSON.stringify(res.user));

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Login failed. Invalid email or password.' };
      }
    } catch {
      setIsLoading(false);
      return { success: false, message: 'Authentication network error' };
    }
  };

  const register = async (name: string, email: string, password: string, role?: string, avatar?: string) => {
    setIsLoading(true);
    try {
      const res = await AuthService.register(name, email, password, role, avatar);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);

        localStorage.setItem('aether_token', res.token);
        localStorage.setItem('aether_user', JSON.stringify(res.user));

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, message: res.message || 'Registration failed.' };
      }
    } catch {
      setIsLoading(false);
      return { success: false, message: 'Network error during registration' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aether_token');
    localStorage.removeItem('aether_user');
    sessionStorage.removeItem('aether_token');
    sessionStorage.removeItem('aether_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
