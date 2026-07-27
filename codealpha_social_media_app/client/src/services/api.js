import axios from 'axios';
import { getToken } from '../utils/storage';

const api = axios.create({
  baseURL: '/api'
});

// Attach Authorization header using unified getToken helper
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
