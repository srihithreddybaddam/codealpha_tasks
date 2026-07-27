const express = require('express');
const router = express.Router();
const { 
  getTasks, 
  createTask, 
  updateTask, 
  moveTask, 
  deleteTask, 
  duplicateTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getTasks);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.post('/:id/move', protect, moveTask);
router.delete('/:id', protect, deleteTask);
router.post('/:id/duplicate', protect, duplicateTask);

module.exports = router;
