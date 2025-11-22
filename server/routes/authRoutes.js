
const express = require('express');
const {
  register,
  login,
  getMe,
 updateProfile
} = require('../controllers/authController');
const { protect} = require('../middlewares/authMiddleware');
const {
  validateRegister,
  validateLogin
} = require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

