const { param, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ApiError(422, 'Validation failed', errors));
  }

  next();
};

/**
 * Validator for interviewId parameter routes.
 */
const validateInterviewIdParam = [
  param('interviewId')
    .isMongoId()
    .withMessage('Interview ID must be a valid MongoDB ObjectId'),
  handleValidationErrors,
];

module.exports = {
  validateInterviewIdParam,
};
