'use strict';

/**
 * authValidator.js
 * ─────────────────────────────────────────────────────────────────────────────
 * express-validator rule sets for authentication endpoints.
 *
 * Each exported array is used directly as route-level middleware:
 *   router.post('/register', registerRules, authController.register);
 *
 * Validation errors are collected and forwarded as a 422 ApiError by
 * the shared handleValidationErrors middleware at the end of each chain.
 */

const { body, validationResult } = require('express-validator');
const ApiError                   = require('../utils/ApiError');

// ─── Shared error collector ───────────────────────────────────────────────────

/**
 * Must be the last item in every validation chain.
 * Collects express-validator errors and forwards them as a 422 ApiError
 * so the global error handler formats the response consistently.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
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

// ─── Register rules ───────────────────────────────────────────────────────────

const registerRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 80 })
    .withMessage('Full name must be between 2 and 80 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),

  handleValidationErrors,
];

// ─── Login rules ──────────────────────────────────────────────────────────────

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors,
];

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  registerRules,
  loginRules,
};
