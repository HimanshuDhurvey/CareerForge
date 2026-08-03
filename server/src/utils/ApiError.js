'use strict';

/**
 * ApiError.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom application error class.
 *
 * All intentional errors thrown inside controllers / services should use
 * this class so the global error handler can respond consistently.
 *
 * Usage:
 *   throw new ApiError(404, 'User not found');
 *   throw new ApiError(422, 'Validation failed', errors);
 */

class ApiError extends Error {
  /**
   * @param {number}   statusCode   HTTP status code (e.g. 400, 401, 404, 500)
   * @param {string}   message      Human-readable error message
   * @param {Array}    [errors=[]]  Optional array of field-level validation errors
   * @param {string}   [stack='']   Optional pre-built stack string
   */
  constructor(statusCode, message, errors = [], stack = '') {
    super(message);

    this.statusCode  = statusCode;
    this.message     = message;
    this.success     = false;
    this.errors      = errors;
    this.isOperational = true; // Distinguishes from unexpected programming errors

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
