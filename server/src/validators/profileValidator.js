'use strict';

/**
 * profileValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Validation rules for profile updates.
 */

const { body, validationResult } = require('express-validator');
const ApiError                   = require('../utils/ApiError');

/**
 * Shared validator error handler middleware.
 */
const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field:   err.path,
      message: err.msg,
    }));
    return next(new ApiError(422, 'Validation failed', errors));
  }

  next();
};

/**
 * Validation rules for updating the profile.
 */
const updateProfileRules = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Full name must be between 2 and 80 characters'),

  body('email')
    .optional()
    .custom((value, { req }) => {
      // Check if email field is attempting to change
      if (value && value.toLowerCase() !== req.user.email.toLowerCase()) {
        throw new Error('Email address is read-only and cannot be modified');
      }
      return true;
    }),

  body('phoneNumber')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[1-9]\d{1,14}$|^[0-9\-+\(\) ]{7,20}$/)
    .withMessage('Please provide a valid phone number'),

  body('graduationYear')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Graduation year must be a valid integer year between 1900 and 2100'),

  body('githubUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL')
    .matches(/github\.com/)
    .withMessage('GitHub URL must be a valid github.com link'),

  body('linkedinUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL')
    .matches(/linkedin\.com/)
    .withMessage('LinkedIn URL must be a valid linkedin.com link'),

  body('portfolioUrl')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid portfolio URL'),

  body('skills')
    .optional()
    .custom((value) => {
      if (!Array.isArray(value) && typeof value !== 'string') {
        throw new Error('Skills must be an array of strings or a comma-separated string');
      }
      return true;
    }),

  handleValidationErrors,
];

module.exports = {
  updateProfileRules,
};
