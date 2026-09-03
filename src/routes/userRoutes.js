const express = require('express');
const userController = require('../controllers/userController');
const { validate } = require('../middlewares/validate');
const { requireTempToken, requireAccessToken } = require('../middlewares/auth');
const { profileImage } = require('../middlewares/upload');

const router = express.Router();

router.post('/otp', validate('requestOtp'), userController.requestOtp);
router.post('/register', requireTempToken, validate('register'), userController.register);
router.post('/login', requireTempToken, validate('login'), userController.login);
router.get('/profile', requireAccessToken, userController.getProfile);
router.put(
  '/profile',
  requireAccessToken,
  profileImage,
  validate('updateProfile'),
  userController.updateProfile
);

module.exports = router;
