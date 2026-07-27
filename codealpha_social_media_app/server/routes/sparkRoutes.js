const express = require('express');
const router = express.Router();
const { createSpark, getSparks, deleteSpark, viewSpark } = require('../controllers/sparkController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('media'), createSpark);
router.get('/', getSparks);
router.delete('/:id', protect, deleteSpark);
router.post('/:id/view', protect, viewSpark);

module.exports = router;
