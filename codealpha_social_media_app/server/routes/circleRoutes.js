const express = require('express');
const router = express.Router();
const { getCircle, updateCircle } = require('../controllers/circleController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCircle);
router.post('/', protect, updateCircle);
router.put('/', protect, updateCircle);

module.exports = router;
