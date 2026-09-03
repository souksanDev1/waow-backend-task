const Joi = require('joi');
const { fail } = require('../utils/response');

const schemas = {
  requestOtp: Joi.object({
    phone_number: Joi.string().trim().min(8).max(20).required(),
  }).unknown(false),
  register: Joi.object({
    otp_code: Joi.string().trim().length(6).required(),
    name: Joi.string().trim().min(1).max(100).required(),
  }).unknown(false),
  login: Joi.object({
    otp_code: Joi.string().trim().length(6).required(),
  }).unknown(false),
  updateProfile: Joi.object({
    name: Joi.string().trim().min(1).max(100),
  }).unknown(false),
};

const validate =
  (schemaName, source = 'body') =>
  (req, res, next) => {
    const schema = schemas[schemaName];
    const payload = req[source] || {};
    const { error, value } = schema.validate(payload, {
      abortEarly: false,
      stripUnknown: false,
    });

    if (!error) {
      req[source] = value;
      return next();
    }

    const unknown = error.details.find((detail) => detail.type === 'object.unknown');
    if (unknown) {
      return fail(res, 'VALIDATION_ERR_UNKNOWN_FIELD', 'Bad Request', 400);
    }

    return fail(res, 'VALIDATION_ERR', error.details[0].message, 400);
  };

module.exports = { validate, schemas };
