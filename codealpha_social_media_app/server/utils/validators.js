const validateSignupInput = ({ name, username, email, password }) => {
  const errors = {};

  if (!name || name.trim().length === 0) {
    errors.name = 'Full Name is required';
  }

  if (!username || username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters long';
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username = 'Username can only contain letters, numbers, and underscores';
  }

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.email = 'Please provide a valid email address';
  }

  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

const validateLoginInput = ({ email, password }) => {
  const errors = {};

  if (!email || email.trim().length === 0) {
    errors.email = 'Email or Username is required';
  }

  if (!password || password.length === 0) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateSignupInput,
  validateLoginInput
};
