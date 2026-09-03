const otpService = require('../services/otpService');
const userService = require('../services/userService');
const { success } = require('../utils/response');

const requestOtp = async (req, res, next) => {
  try {
    const result = await otpService.createOtp(req.body.phone_number);
    return success(
      res,
      { otp_code: result.otp_code, expires_in: 60 },
      200,
      {
        'x-temp-token': result.tempToken,
        Authorization: `Bearer ${result.tempToken}`,
      }
    );
  } catch (error) {
    return next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const data = await userService.register({
      phoneNumber: req.tempAuth.phone_number,
      otpCode: req.body.otp_code,
      name: req.body.name,
    });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await userService.login({
      phoneNumber: req.tempAuth.phone_number,
      otpCode: req.body.otp_code,
    });
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const data = await userService.getProfile(req.auth.user_id);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.file) {
      payload.profile_image = `/uploads/${req.file.filename}`;
    }
    const data = await userService.updateProfile(req.auth.user_id, payload);
    return success(res, data);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  requestOtp,
  register,
  login,
  getProfile,
  updateProfile,
};
