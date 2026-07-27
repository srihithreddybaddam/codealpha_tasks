const express = require('express');
const router = express.Router();
const { getMemories, pinMemory, deleteMemory } = require('../controllers/memoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMemories);
router.get('/:userId', getMemories);
router.post('/', protect, pinMemory);
router.delete('/:id', protect, deleteMemory);

module.exports = router;
