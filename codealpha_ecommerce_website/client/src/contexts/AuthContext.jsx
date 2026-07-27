import React, { createContext, useState, useEffect } from 'react';
import { getStorage, setStorage, removeStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../utils/constants';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStorage(STORAGE_KEYS.USER, null));
  const [token, setToken] = useState(() => getStorage(STORAGE_KEYS.TOKEN, null));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);

  // Validate persistent login on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = getStorage(STORAGE_KEYS.TOKEN, null);
      if (storedToken) {
        try {
          const res = await authService.getProfile();
          if (res.data?.user) {
            setUser(res.data.user);
            setStorage(STORAGE_KEYS.USER, res.data.user);
            setIsAuthenticated(true);
          }
        } catch (err) {
          // If token expired or invalid, reset session
          console.warn('Session verification notice:', err.message);
          if (!getStorage(STORAGE_KEYS.USER)) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (emailOrCredentials, password) => {
    setLoading(true);
    try {
      const credentials =
        typeof emailOrCredentials === 'object' && emailOrCredentials !== null
          ? emailOrCredentials
          : { email: emailOrCredentials, password };

      const res = await authService.login(credentials);
      const userData = res.data?.user || res.user;
      const authToken = res.data?.token || res.token;

      setUser(userData);
      setToken(authToken);
      setIsAuthenticated(true);
      setStorage(STORAGE_KEYS.USER, userData);
      setStorage(STORAGE_KEYS.TOKEN, authToken);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const register = async (nameOrUserData, email, password) => {
    setLoading(true);
    try {
      const userData =
        typeof nameOrUserData === 'object' && nameOrUserData !== null
          ? nameOrUserData
          : { name: nameOrUserData, email, password };

      const res = await authService.register(userData);
      const userObj = res.data?.user || res.user;
      const authToken = res.data?.token || res.token;

      setUser(userObj);
      setToken(authToken);
      setIsAuthenticated(true);
      setStorage(STORAGE_KEYS.USER, userObj);
      setStorage(STORAGE_KEYS.TOKEN, authToken);
      return userObj;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    removeStorage(STORAGE_KEYS.USER);
    removeStorage(STORAGE_KEYS.TOKEN);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authService.updateProfile(profileData);
      const updated = res.data?.user || res.user;
      setUser(updated);
      setStorage(STORAGE_KEYS.USER, updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
