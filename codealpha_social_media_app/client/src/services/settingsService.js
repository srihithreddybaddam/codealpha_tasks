import api from './api';

const updateSettings = async (settingsData) => {
  const response = await api.put('/settings', settingsData);
  return response.data;
};

const changePassword = async (passwords) => {
  const response = await api.put('/password', passwords);
  return response.data;
};

const getSessions = async () => {
  const response = await api.get('/sessions');
  return response.data;
};

const deleteSessions = async () => {
  const response = await api.delete('/sessions');
  return response.data;
};

const blockUser = async (targetUserId) => {
  const response = await api.post('/block', { targetUserId });
  return response.data;
};

const unblockUser = async (targetUserId) => {
  const response = await api.delete('/block', { data: { targetUserId } });
  return response.data;
};

const getBlockedUsers = async () => {
  const response = await api.get('/block');
  return response.data;
};

const muteUser = async (targetUserId) => {
  const response = await api.post('/mute', { targetUserId });
  return response.data;
};

const unmuteUser = async (targetUserId) => {
  const response = await api.delete('/mute', { data: { targetUserId } });
  return response.data;
};

const getMutedUsers = async () => {
  const response = await api.get('/mute');
  return response.data;
};

const submitReport = async (reportData) => {
  const response = await api.post('/report', reportData);
  return response.data;
};

const deleteAccount = async (password) => {
  const response = await api.delete('/account', { data: { password } });
  return response.data;
};

export default {
  updateSettings,
  changePassword,
  getSessions,
  deleteSessions,
  blockUser,
  unblockUser,
  getBlockedUsers,
  muteUser,
  unmuteUser,
  getMutedUsers,
  submitReport,
  deleteAccount
};
