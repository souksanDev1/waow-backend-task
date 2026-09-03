const crypto = require('crypto');
const config = require('../config');

const generateOtp = (length = config.otp.length) => {
  const max = 10 ** length;
  return String(crypto.randomInt(0, max)).padStart(length, '0');
};

module.exports = { generateOtp };
