'use strict';

/**
 * errorMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Express error handler.
 *
 * Must be registered LAST in app.js (after routes and 404 handler).
 * Catches every error forwarded via next(err) and returns a consistent
 * JSON error response.
 *
 * Handled error types:
 *   - ApiError             → operational, uses built-in statusCode
 *   - Mongoose CastError   → 400 (invalid ObjectId)
 *   - Mongoose ValidationError → 422
 *   - MongoDB duplicate key (code 11000) → 409
 *   - Everything else      → 500 Internal Server Error
 */

const ApiError = require('../utils/ApiError');
const logger   = require('../utils/logger');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Normalises any thrown value into an ApiError instance.
 * @param {*} err
 * @returns {ApiError}
 */
const normalise = (err) => {
  // Already an ApiError — pass through
  if (err instanceof ApiError) return err;

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return new ApiError(400, `Invalid value for field: ${err.path}`);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
    return new ApiError(422, 'Validation failed', errors);
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new ApiError(409, `Duplicate value for '${field}'. Please use a different value.`);
  }

  // Unknown / unexpected error
  return new ApiError(
    err.statusCode || 500,
    IS_PRODUCTION ? 'An unexpected error occurred' : (err.message || 'Internal Server Error')
  );
};

/**
 * Express global error-handling middleware (4 arguments — required by Express).
 *
 * @param {Error}                          err
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next  // Must be declared even if unused
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  const apiError = normalise(err);

  // Log 5xx errors as errors; 4xx as warnings
  if (apiError.statusCode >= 500) {
    logger.error(
      `[${req.method}] ${req.originalUrl} → ${apiError.statusCode}: ${apiError.message}`,
      IS_PRODUCTION ? null : err
    );
  } else {
    logger.warn(
      `[${req.method}] ${req.originalUrl} → ${apiError.statusCode}: ${apiError.message}`
    );
  }

  const body = {
    success:    false,
    statusCode: apiError.statusCode,
    message:    apiError.message,
    ...(apiError.errors.length > 0 && { errors: apiError.errors }),
    ...(!IS_PRODUCTION && { stack: apiError.stack }),
  };

  res.status(apiError.statusCode).json(body);
};

module.exports = errorMiddleware;
