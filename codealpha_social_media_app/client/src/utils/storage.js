const TOKEN_KEY = 'vibely_token';
const REMEMBER_KEY = 'vibely_remember_me';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setToken = (token, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(REMEMBER_KEY);
  }
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
};
