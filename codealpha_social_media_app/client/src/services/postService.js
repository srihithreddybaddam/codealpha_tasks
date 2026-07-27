import api from './api';

const createPost = async (formData) => {
  const response = await api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

const updatePost = async (id, formData) => {
  const response = await api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

const getUserPosts = async (userId) => {
  const response = await api.get(`/posts/user/${userId}`);
  return response.data;
};

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUserPosts
};
