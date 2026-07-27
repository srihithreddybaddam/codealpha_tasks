export const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

export const validateUsername = (username) => {
  return typeof username === 'string' && username.trim().length >= 3 && username.trim().length <= 30 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

export const validateBio = (bio) => {
  return typeof bio === 'string' && bio.length <= 200;
};

export const validateWebsite = (url) => {
  if (!url || url.trim().length === 0) return true;
  const pattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return pattern.test(url);
};

export const validateImageFile = (file) => {
  if (!file) return { isValid: false, error: 'No file selected' };

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return { isValid: false, error: 'Only JPG, JPEG, PNG, and WEBP images are supported.' };
  }

  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSizeInBytes) {
    return { isValid: false, error: 'Image size cannot exceed 5MB.' };
  }

  return { isValid: true, error: null };
};
