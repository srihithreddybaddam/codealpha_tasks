import api from './api';
import { setToken, removeToken } from '../utils/storage';

const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  if (response.data.success && response.data.token) {
    setToken(response.data.token, true);
  }
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.success && response.data.token) {
    setToken(response.data.token, credentials.rememberMe !== false);
  }
  return response.data;
};

const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    // Ignore logout network errors
  } finally {
    removeToken();
  }
};

export default {
  signup,
  login,
  getMe,
  logout
};
