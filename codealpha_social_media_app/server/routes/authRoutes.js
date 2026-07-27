const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/register', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
