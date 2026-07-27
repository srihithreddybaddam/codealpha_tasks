const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.config');
const ApiError = require('../utils/apiError.util');

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = decoded;
      return next();
    } catch (error) {
      return next(new ApiError(401, 'Not authorized, invalid token'));
    }
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, no bearer token provided'));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError(403, 'Forbidden. Admin privileges required.'));
};

module.exports = {
  protect,
  adminOnly,
};
