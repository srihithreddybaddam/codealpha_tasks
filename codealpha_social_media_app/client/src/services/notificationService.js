import api from './api';

const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

const markAsRead = async (id) => {
  const response = await api.put('/notifications/read', { id });
  return response.data;
};

const markAllRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export default {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification
};
