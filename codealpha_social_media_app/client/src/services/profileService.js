import api from './api';

const getMyProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

const getProfileByUsername = async (username) => {
  const response = await api.get(`/profile/${username}`);
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response.data;
};

const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await api.post('/upload/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

const uploadCoverImage = async (file) => {
  const formData = new FormData();
  formData.append('coverImage', file);
  const response = await api.post('/upload/cover-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export default {
  getMyProfile,
  getProfileByUsername,
  updateProfile,
  uploadProfilePicture,
  uploadCoverImage
};
