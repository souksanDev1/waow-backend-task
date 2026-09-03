const jwt = require('jsonwebtoken');
const config = require('../config');

const signTempToken = (phoneNumber) =>
  jwt.sign({ phone_number: phoneNumber, token_type: 'temp' }, config.jwtSecret, {
    expiresIn: config.jwtTempExpiresIn,
  });

const signAccessToken = (user) =>
  jwt.sign(
    {
      user_id: user.id,
      phone_number: user.phone_number,
      token_type: 'access',
    },
    config.jwtSecret,
    { expiresIn: config.jwtAccessExpiresIn }
  );

const verifyToken = (token) => jwt.verify(token, config.jwtSecret);

module.exports = { signTempToken, signAccessToken, verifyToken };
