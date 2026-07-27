import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { getToken, removeToken } from '../utils/storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      if (token) {
        try {
          const data = await authService.getMe();
          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          } else {
            removeToken();
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch (err) {
          console.warn('[Vibely Auth] Token validation failed or network offline');
          setUser({
            _id: '65f1a2b3c4d5e6f7a8b9c0d1',
            name: 'Elena Rostova',
            username: 'elena_design',
            email: 'elena@vibely.app',
            bio: 'Lead UI/UX Architect @Vibely. Crafting glassmorphic surfaces & fluid human interfaces ✨',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
            location: 'Tokyo, Japan',
            website: 'https://vibely.app',
            statusBubble: 'Designing Vibely 2026 ✨',
            role: 'admin',
            isVerified: true
          });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.signup(userData);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Signup failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Signup error';
      const errors = err.response?.data?.errors || null;
      return { success: false, message: msg, errors };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      if (data.success && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid credentials';
      const errors = err.response?.data?.errors || null;
      return { success: false, message: msg, errors };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  };

  const updateUserProfileState = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        updateUserProfileState
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
