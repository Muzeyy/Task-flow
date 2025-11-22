// server/routes/userRoutes.js
const express = require('express');
const { getMe: getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { validateProfile } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(validateProfile, updateProfile);

module.exports = router;