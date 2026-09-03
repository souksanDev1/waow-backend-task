const { Op } = require('sequelize');
const { OtpVerification } = require('../models');
const config = require('../config');
const { AppError } = require('../utils/AppError');
const { generateOtp } = require('../utils/otp');
const { signTempToken } = require('../utils/jwt');

const countRecentRequests = (phoneNumber) =>
  OtpVerification.count({
    where: {
      phone_number: phoneNumber,
      created_at: { [Op.gte]: new Date(Date.now() - config.otp.requestWindowMs) },
    },
  });

const createOtp = async (phoneNumber) => {
  const recentCount = await countRecentRequests(phoneNumber);
  if (recentCount >= config.otp.maxRequests) {
    throw new AppError(
      'OTP_ERR_MAX_REQUEST',
      'Max OTP request exceeded, Please try again next 1 hour',
      429
    );
  }

  const otp = await OtpVerification.create({
    phone_number: phoneNumber,
    otp_code: generateOtp(),
    status: 'pending',
    attempt_count: 0,
    expires_at: new Date(Date.now() + config.otp.ttlMs),
  });

  return {
    otp_code: otp.otp_code,
    tempToken: signTempToken(phoneNumber),
  };
};

const getLatestPendingOtp = async (phoneNumber, transaction) => {
  const otp = await OtpVerification.findOne({
    where: { phone_number: phoneNumber },
    order: [['created_at', 'DESC']],
    transaction,
    lock: transaction ? transaction.LOCK.UPDATE : undefined,
  });

  if (!otp) {
    throw new AppError('OTP_ERR_NOT_FOUND', 'Please request OTP first', 400);
  }

  return otp;
};

const verifyOtp = async (phoneNumber, otpCode, transaction) => {
  const otp = await getLatestPendingOtp(phoneNumber, transaction);

  if (otp.status === 'locked' || otp.attempt_count >= config.otp.maxAttempts) {
    throw new AppError(
      'OTP_ERR_MAX_ATTEMPT',
      'Wrong OTP attempted exceeded, Please request new OTP instead',
      400
    );
  }

  if (otp.status === 'verified') {
    throw new AppError('OTP_ERR_ALREADY_USED', 'OTP already used, Please request new OTP', 400);
  }

  if (new Date(otp.expires_at).getTime() < Date.now()) {
    throw new AppError('OTP_ERR_EXPIRED', 'OTP expired, Please request new OTP', 400);
  }

  if (otp.otp_code !== otpCode) {
    const nextAttempts = otp.attempt_count + 1;
    await otp.update(
      {
        attempt_count: nextAttempts,
        status: nextAttempts >= config.otp.maxAttempts ? 'locked' : otp.status,
      },
      { transaction }
    );

    throw new AppError('OTP_ERR_INVALID', 'Invalid OTP code', 400);
  }

  await otp.update(
    {
      status: 'verified',
      verified_at: new Date(),
    },
    { transaction }
  );

  return otp;
};

module.exports = { createOtp, verifyOtp };
