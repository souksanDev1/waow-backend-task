const path = require('path');
const fs = require('fs');
const multer = require('multer');
const config = require('../config');
const { fail } = require('../utils/response');

const uploadRoot = path.resolve(process.cwd(), config.uploadDir);
fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(new Error('INVALID_IMAGE_TYPE'));
      return;
    }
    cb(null, true);
  },
});

const profileImage = (req, res, next) => {
  upload.single('profile_image')(req, res, (err) => {
    if (!err) {
      return next();
    }
    if (err.message === 'INVALID_IMAGE_TYPE') {
      return fail(res, 'VALIDATION_ERR', 'profile_image must be jpeg, png, or webp', 400);
    }
    return fail(res, 'VALIDATION_ERR', err.message, 400);
  });
};

module.exports = { profileImage, uploadRoot };
