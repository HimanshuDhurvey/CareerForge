'use strict';

/**
 * resumeService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Business logic for resume file management.
 */

const fs       = require('fs');
const path     = require('path');
const Resume   = require('../models/resumeModel');
const ApiError = require('../utils/ApiError');
const logger   = require('../utils/logger');

/**
 * Safely delete a file from disk (ignores missing-file errors).
 * @param {string} filePath
 */
const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      logger.info(`Deleted file: ${filePath}`);
    }
  } catch (err) {
    logger.warn(`Could not delete file ${filePath}: ${err.message}`);
  }
};

/**
 * Upload a new resume for the user.
 * Deletes the previous file from disk if one exists.
 *
 * @param {string} userId
 * @param {Express.Multer.File} file
 * @returns {Promise<Object>} Saved resume document
 */
const uploadResume = async (userId, file) => {
  if (!file) {
    throw new ApiError(400, 'No file uploaded. Please attach a PDF file.');
  }

  // Delete old resume file + document if present
  const existing = await Resume.findOne({ user: userId });
  if (existing) {
    safeUnlink(existing.path);
    await Resume.deleteOne({ user: userId });
  }

  const resume = await Resume.create({
    user:         userId,
    originalName: file.originalname,
    filename:     file.filename,
    fileSize:     file.size,
    mimeType:     file.mimetype,
    path:         file.path,
    uploadedAt:   new Date(),
    analysisStatus: 'pending',
    analysisResult: null,
  });

  return resume;
};

/**
 * Get the active resume for a user.
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
const getResume = async (userId) => {
  return Resume.findOne({ user: userId });
};

/**
 * Delete the user's resume document + file from disk.
 * @param {string} userId
 */
const deleteResume = async (userId) => {
  const resume = await Resume.findOne({ user: userId });
  if (!resume) {
    throw new ApiError(404, 'No resume found to delete.');
  }
  safeUnlink(resume.path);
  await Resume.deleteOne({ user: userId });
};

module.exports = { uploadResume, getResume, deleteResume };
