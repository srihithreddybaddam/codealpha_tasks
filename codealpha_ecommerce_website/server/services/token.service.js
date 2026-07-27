const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');

const generateAuthToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

const verifyAuthToken = (token) => {
  return jwt.verify(token, jwtConfig.secret);
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
};
