import api from './api';

const search = async (query, type = 'all') => {
  const response = await api.get(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  return response.data;
};

const searchUsers = async (query) => {
  const response = await api.get(`/search/users?q=${encodeURIComponent(query)}`);
  return response.data;
};

const searchPosts = async (query) => {
  const response = await api.get(`/search/posts?q=${encodeURIComponent(query)}`);
  return response.data;
};

const searchHashtags = async (query) => {
  const response = await api.get(`/search/hashtags?q=${encodeURIComponent(query)}`);
  return response.data;
};

const getPostsByHashtag = async (tagName) => {
  const response = await api.get(`/hashtags/${encodeURIComponent(tagName)}`);
  return response.data;
};

const getExplore = async () => {
  const response = await api.get('/explore');
  return response.data;
};

const getTrending = async () => {
  const response = await api.get('/trending');
  return response.data;
};

const getSuggestedUsers = async () => {
  const response = await api.get('/suggested-users');
  return response.data;
};

export default {
  search,
  searchUsers,
  searchPosts,
  searchHashtags,
  getPostsByHashtag,
  getExplore,
  getTrending,
  getSuggestedUsers
};
