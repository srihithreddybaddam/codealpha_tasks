const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Backend server health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    status: 'running',
    timestamp: new Date().toISOString(),
    service: 'Basketly Express Backend Core',
  });
});

module.exports = router;
