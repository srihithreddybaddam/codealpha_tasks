const express = require('express');
const router = express.Router();
const { updateStatus, getStatus } = require('../controllers/statusController');
const { protect } = require('../middleware/authMiddleware');

router.put('/', protect, updateStatus);
router.post('/', protect, updateStatus);
router.get('/', getStatus);

module.exports = router;
