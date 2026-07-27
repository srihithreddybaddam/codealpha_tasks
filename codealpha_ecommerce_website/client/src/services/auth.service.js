import api from './api.service';

export const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  getProfile: async () => {
    return await api.get('/auth/profile');
  },
  updateProfile: async (profileData) => {
    return await api.put('/auth/profile', profileData);
  },
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },
};
