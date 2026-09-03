const { sequelize, User } = require('../models');
const { AppError } = require('../utils/AppError');
const { signAccessToken } = require('../utils/jwt');
const { verifyOtp } = require('./otpService');

const withOtpTransaction = async (work) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await work(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    const persistAttempt =
      error instanceof AppError &&
      (error.code === 'OTP_ERR_INVALID' || error.code === 'OTP_ERR_MAX_ATTEMPT');

    if (!transaction.finished) {
      if (persistAttempt) {
        await transaction.commit();
      } else {
        await transaction.rollback();
      }
    }
    throw error;
  }
};

const register = async ({ phoneNumber, otpCode, name }) => {
  return withOtpTransaction(async (transaction) => {
    await verifyOtp(phoneNumber, otpCode, transaction);

    const existing = await User.findOne({
      where: { phone_number: phoneNumber },
      transaction,
    });
    if (existing) {
      throw new AppError('USER_ERR_ALREADY_EXISTS', 'User already registered', 409);
    }

    const user = await User.create(
      { phone_number: phoneNumber, name },
      { transaction }
    );

    return {
      access_token: signAccessToken(user),
      user: user.toProfile(),
    };
  });
};

const login = async ({ phoneNumber, otpCode }) => {
  return withOtpTransaction(async (transaction) => {
    await verifyOtp(phoneNumber, otpCode, transaction);

    const user = await User.findOne({
      where: { phone_number: phoneNumber },
      transaction,
    });
    if (!user) {
      throw new AppError('USER_ERR_NOT_FOUND', 'User not found, please register first', 404);
    }

    return {
      access_token: signAccessToken(user),
      user: user.toProfile(),
    };
  });
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('USER_ERR_NOT_FOUND', 'User not found', 404);
  }
  return user.toProfile();
};

const updateProfile = async (userId, payload) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new AppError('USER_ERR_NOT_FOUND', 'User not found', 404);
  }

  if (payload.phone_number && payload.phone_number !== user.phone_number) {
    throw new AppError('USER_ERR_PHONE_IMMUTABLE', 'phone_number cannot be updated', 400);
  }

  await user.update({
    name: payload.name ?? user.name,
    profile_image: payload.profile_image ?? user.profile_image,
  });

  return user.toProfile();
};

module.exports = { register, login, getProfile, updateProfile };
