const config = require('./env.config');

module.exports = {
  secret: config.jwtSecret,
  expiresIn: config.jwtExpiresIn,
};
