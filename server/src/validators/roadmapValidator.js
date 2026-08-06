'use strict';

/**
 * roadmapValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * express-validator rule sets for Career Roadmap endpoints.
 */

const { body, param, validationResult } = require('express-validator');
const ApiError                           = require('../utils/ApiError');

/**
 * Collects validation errors and passes them to global error handler as 422 ApiError.
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

const generateRoadmapRules = [
  body('careerGoal')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Career goal must not exceed 150 characters'),
  handleValidationErrors,
];

const roadmapIdRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid roadmap ID format'),
  handleValidationErrors,
];

module.exports = {
  generateRoadmapRules,
  roadmapIdRules,
};
