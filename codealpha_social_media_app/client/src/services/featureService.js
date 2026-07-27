import api from './api';

// Daily Sparks
const getSparks = async () => {
  const response = await api.get('/daily-sparks');
  return response.data;
};

const createSpark = async (formData) => {
  const response = await api.post('/daily-sparks', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deleteSpark = async (id) => {
  const response = await api.delete(`/daily-sparks/${id}`);
  return response.data;
};

const viewSpark = async (id) => {
  const response = await api.post(`/daily-sparks/${id}/view`);
  return response.data;
};

// Moments
const getMoments = async () => {
  const response = await api.get('/moments');
  return response.data;
};

const createMoment = async (formData) => {
  const response = await api.post('/moments', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const updateMoment = async (id, formData) => {
  const response = await api.put(`/moments/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deleteMoment = async (id) => {
  const response = await api.delete(`/moments/${id}`);
  return response.data;
};

const viewMoment = async (id) => {
  const response = await api.post(`/moments/${id}/view`);
  return response.data;
};

// Private Circle
const getCircle = async () => {
  const response = await api.get('/circle');
  return response.data;
};

const updateCircle = async (members) => {
  const response = await api.put('/circle', { members });
  return response.data;
};

// Memory Wall
const getMemories = async (userId) => {
  const response = await api.get(userId ? `/memory/${userId}` : '/memory');
  return response.data;
};

const pinMemory = async (data) => {
  const response = await api.post('/memory', data);
  return response.data;
};

const deleteMemory = async (id) => {
  const response = await api.delete(`/memory/${id}`);
  return response.data;
};

// Status Bubble
const getStatus = async (userId) => {
  const response = await api.get(`/status?userId=${userId}`);
  return response.data;
};

const updateStatus = async (statusBubble) => {
  const response = await api.put('/status', { statusBubble });
  return response.data;
};

export default {
  getSparks,
  createSpark,
  deleteSpark,
  viewSpark,
  getMoments,
  createMoment,
  updateMoment,
  deleteMoment,
  viewMoment,
  getCircle,
  updateCircle,
  getMemories,
  pinMemory,
  deleteMemory,
  getStatus,
  updateStatus
};
