'use strict';

/**
 * interviewValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * express-validator rule sets for Interview endpoints.
 */

const { body, param, validationResult } = require('express-validator');
const ApiError                           = require('../utils/ApiError');

// ─── Shared error collector ───────────────────────────────────────────────────

/**
 * Collects validation errors and passes them to the global error handler as 422 ApiError.
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

// ─── Create Interview Rules ───────────────────────────────────────────────────

const createInterviewRules = [
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be one of: Easy, Medium, Hard'),

  body('interviewType')
    .trim()
    .notEmpty()
    .withMessage('Interview type is required')
    .isIn(['Technical', 'HR', 'Behavioral', 'Mixed'])
    .withMessage('Interview type must be one of: Technical, HR, Behavioral, Mixed'),

  body('totalQuestions')
    .notEmpty()
    .withMessage('Total questions is required')
    .isInt({ min: 1, max: 100 })
    .withMessage('Total questions must be an integer between 1 and 100'),

  body('duration')
    .notEmpty()
    .withMessage('Duration is required')
    .isNumeric()
    .custom((val) => Number(val) >= 1)
    .withMessage('Duration must be at least 1 minute'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title must not exceed 150 characters'),

  handleValidationErrors,
];

// ─── Update Interview Rules ───────────────────────────────────────────────────

const updateInterviewRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid interview ID format'),

  body('status')
    .optional()
    .trim()
    .isIn(['pending', 'in_progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in_progress, completed, cancelled'),

  body('currentQuestionIndex')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Current question index must be a non-negative integer'),

  body('startedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Started date must be a valid ISO 8601 date format'),

  body('completedAt')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Completed date must be a valid ISO 8601 date format'),

  body('score')
    .optional()
    .isNumeric()
    .custom((val) => Number(val) >= 0)
    .withMessage('Score must be a non-negative number'),

  body('feedback')
    .optional()
    .isString()
    .withMessage('Feedback must be a string'),

  handleValidationErrors,
];

// ─── ID Param Rules ───────────────────────────────────────────────────────────

const interviewIdParamRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid interview ID format'),

  handleValidationErrors,
];

module.exports = {
  createInterviewRules,
  updateInterviewRules,
  interviewIdParamRules,
};
