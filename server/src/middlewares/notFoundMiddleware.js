'use strict';

/**
 * notFoundMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Catches any request that did not match a registered route and forwards a
 * 404 ApiError to the global error handler.
 *
 * Must be registered AFTER all route mounts in app.js.
 */

const ApiError = require('../utils/ApiError');

/**
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = notFoundMiddleware;
