const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

const User = require('./user')(sequelize);
const OtpVerification = require('./otpVerification')(sequelize);

module.exports = {
  sequelize,
  Sequelize,
  User,
  OtpVerification,
};
