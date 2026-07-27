const errorHandler = (err, req, res, next) => {
  console.error('[Vibely Error Handler]', err.stack || err);

  const statusCode = err.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
