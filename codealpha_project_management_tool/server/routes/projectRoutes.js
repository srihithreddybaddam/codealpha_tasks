const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject, 
  toggleFavorite, 
  archiveProject, 
  duplicateProject 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);
router.post('/:id/favorite', protect, toggleFavorite);
router.post('/:id/archive', protect, archiveProject);
router.post('/:id/duplicate', protect, duplicateProject);

module.exports = router;
