'use strict';

/**
 * uploadMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Multer disk-storage configuration for resume PDF uploads.
 * Allowed: application/pdf only | Max size: 5 MB
 * Stored in: server/uploads/resumes/<userId>-<timestamp>.pdf
 */

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const ApiError = require('../utils/ApiError');

// Ensure uploads directory exists at runtime
const UPLOADS_DIR = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename(req, _file, cb) {
    const userId    = req.user._id.toString();
    const timestamp = Date.now();
    cb(null, `${userId}-${timestamp}.pdf`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;
