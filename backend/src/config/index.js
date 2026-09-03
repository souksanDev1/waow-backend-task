module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  jwtTempExpiresIn: process.env.JWT_TEMP_EXPIRES_IN || '10m',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  otp: {
    ttlMs: 60 * 1000,
    maxAttempts: 3,
    maxRequests: 3,
    requestWindowMs: 60 * 60 * 1000,
    length: 6,
  },
};
