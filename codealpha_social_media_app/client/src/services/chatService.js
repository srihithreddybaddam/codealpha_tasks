import api from './api';

const getConversations = async () => {
  const response = await api.get('/conversations');
  return response.data;
};

const getMessages = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

const sendMessage = async (formData) => {
  const response = await api.post('/messages', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deleteMessage = async (messageId) => {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
};

export default {
  getConversations,
  getMessages,
  sendMessage,
  deleteMessage
};
