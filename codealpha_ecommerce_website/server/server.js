const express = require('express');
const cors = require('cors');
const config = require('./config/env.config');
const { connectDB } = require('./config/db.config');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const loggerMiddleware = require('./middleware/logger.middleware');

const app = express();

// Initialize MongoDB Connection
connectDB();

// Dynamic CORS Middleware for Seamless Development & Production Uptime
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:') ||
        config.env === 'development'
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// API Route Registration
app.use('/api', apiRoutes);

// 404 Handler for Unmatched API Endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Express Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🚀 BASKETLY GROCERY E-COMMERCE SERVER RUNNING`);
  console.log(`  Environment: ${config.env}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
