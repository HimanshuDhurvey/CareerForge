'use strict';

/**
 * interviewValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * express-validator rule sets for Interview Engine endpoints.
 */

const { body, param, validationResult } = require('express-validator');
const ApiError                           = require('../utils/ApiError');

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

// ─── Start Interview Rules ───────────────────────────────────────────────────

const startInterviewRules = [
  body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required'),

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

  body('numberOfQuestions')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of questions must be an integer between 1 and 50'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Title must not exceed 150 characters'),

  handleValidationErrors,
];

// ─── Save Answer Rules ───────────────────────────────────────────────────────

const saveAnswerRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid interview ID format'),

  body('questionId')
    .notEmpty()
    .withMessage('Question ID is required')
    .isMongoId()
    .withMessage('Invalid question ID format'),

  body('answer')
    .trim()
    .notEmpty()
    .withMessage('Answer text is required'),

  body('timeTaken')
    .optional()
    .isNumeric()
    .custom((val) => Number(val) >= 0)
    .withMessage('Time taken must be a non-negative number'),

  handleValidationErrors,
];

// ─── Update Interview Rules (Legacy/Admin) ───────────────────────────────────

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
  startInterviewRules,
  saveAnswerRules,
  updateInterviewRules,
  interviewIdParamRules,
};
