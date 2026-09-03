const { fail } = require('../utils/response');
const { AppError } = require('../utils/AppError');

const errorHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    return fail(res, err.code, err.message, err.status);
  }

  return fail(res, 'SERVER_ERR', err.message || 'Internal server error', 500);
};

module.exports = { errorHandler };
