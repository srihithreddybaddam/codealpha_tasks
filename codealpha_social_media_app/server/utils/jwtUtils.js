const jwt = require('jsonwebtoken');

const generateToken = (userId, role = 'user', rememberMe = true) => {
  const expiresIn = rememberMe ? (process.env.JWT_EXPIRE || '30d') : '1d';
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'vibely_super_secret_jwt_key_2026_stitch_app',
    { expiresIn }
  );
};

const verifyToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET || 'vibely_super_secret_jwt_key_2026_stitch_app'
  );
};

module.exports = {
  generateToken,
  verifyToken
};
