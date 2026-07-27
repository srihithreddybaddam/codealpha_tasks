import api from './api';

const likePost = async (postId) => {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
};

const unlikePost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/like`);
  return response.data;
};

const addComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comment`, { content });
  return response.data;
};

const getPostComments = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

const replyToComment = async (commentId, content) => {
  const response = await api.post(`/comments/${commentId}/reply`, { content });
  return response.data;
};

const editComment = async (commentId, content) => {
  const response = await api.put(`/comments/${commentId}`, { content });
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

const bookmarkPost = async (postId) => {
  const response = await api.post(`/posts/${postId}/bookmark`);
  return response.data;
};

const unbookmarkPost = async (postId) => {
  const response = await api.delete(`/posts/${postId}/bookmark`);
  return response.data;
};

const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export default {
  likePost,
  unlikePost,
  addComment,
  getPostComments,
  replyToComment,
  editComment,
  deleteComment,
  bookmarkPost,
  unbookmarkPost,
  getBookmarks
};
