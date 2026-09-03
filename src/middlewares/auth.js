const { verifyToken } = require('../utils/jwt');
const { fail } = require('../utils/response');

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return req.headers['x-temp-token'] || req.headers['x-access-token'];
};

const requireTempToken = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Temporary JWT token is required', 401);
    }

    const payload = verifyToken(token);
    if (payload.token_type !== 'temp' || !payload.phone_number) {
      return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Invalid temporary token', 401);
    }

    req.tempAuth = payload;
    return next();
  } catch (error) {
    return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Invalid or expired token', 401);
  }
};

const requireAccessToken = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Access token is required', 401);
    }

    const payload = verifyToken(token);
    if (payload.token_type !== 'access' || !payload.user_id) {
      return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Invalid access token', 401);
    }

    req.auth = payload;
    return next();
  } catch (error) {
    return fail(res, 'AUTH_ERR_UNAUTHORIZED', 'Invalid or expired token', 401);
  }
};

module.exports = { requireTempToken, requireAccessToken };
