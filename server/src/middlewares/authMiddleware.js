'use strict';

/**
 * authMiddleware.js
 * ─────────────────────────────────────────────────────────────────────────────
 * JWT authentication middleware.
 *
 * Protects routes that require an authenticated user.
 * Reads the token from the Authorization header (Bearer <token>) or,
 * as a fallback, from the 'accessToken' HttpOnly cookie.
 *
 * On success: attaches the full User document to req.user and calls next().
 * On failure: forwards a 401 ApiError to the global error handler.
 *
 * Usage:
 *   const { protect } = require('../middlewares/authMiddleware');
 *   router.get('/me', protect, authController.getMe);
 */

const jwt     = require('jsonwebtoken');
const User    = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const env     = require('../config/env');

/**
 * Extracts the raw JWT string from the incoming request.
 * Priority: Authorization header → cookie.
 *
 * @param {import('express').Request} req
 * @returns {string|null}
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
};

/**
 * protect middleware
 * Verifies the JWT and attaches req.user for downstream handlers.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please log in.');
    }

    // Verify signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Session expired. Please log in again.');
      }
      throw new ApiError(401, 'Invalid token. Please log in again.');
    }

    // Fetch the user — ensures account wasn't deleted since token was issued
    const user = await User.findById(decoded.sub);
    if (!user) {
      throw new ApiError(401, 'User no longer exists. Please register.');
    }

    // Attach to request for downstream use
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * authorize(...roles) — role-based access guard.
 * Use AFTER protect to restrict a route to specific roles.
 *
 * Usage:
 *   router.delete('/user/:id', protect, authorize('admin'), controller.deleteUser);
 *
 * @param  {...string} roles  Allowed roles (e.g. 'admin', 'student')
 * @returns {import('express').RequestHandler}
 */
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ApiError(403, `Role '${req.user.role}' is not authorised to access this resource`)
    );
  }
  next();
};

module.exports = { protect, authorize };
