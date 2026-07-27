import api from './api';

const followUser = async (userId) => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

const unfollowUser = async (userId) => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

const getFollowers = async (userId) => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

const getFollowing = async (userId) => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};

export default {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing
};
