const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { signup, login, getMyProfile, updateMyProfile } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

module.exports = router;