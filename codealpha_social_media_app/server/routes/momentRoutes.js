const express = require('express');
const router = express.Router();
const { createMoment, getMoments, updateMoment, deleteMoment, incrementViews } = require('../controllers/momentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('media'), createMoment);
router.get('/', getMoments);
router.put('/:id', protect, upload.single('media'), updateMoment);
router.delete('/:id', protect, deleteMoment);
router.post('/:id/view', incrementViews);

module.exports = router;
