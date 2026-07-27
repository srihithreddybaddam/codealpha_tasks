const ApiError = require('../utils/apiError.util');

const validate = (schema) => (req, res, next) => {
  // Placeholder for schema validation logic (e.g. Joi / Custom schema checks)
  next();
};

module.exports = validate;
