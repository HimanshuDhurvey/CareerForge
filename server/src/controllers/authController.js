'use strict';

/**
 * authController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP layer for authentication endpoints.
 *
 * Keeps controllers thin — all business logic lives in authService.js.
 *
 * Endpoints:
 *   POST   /api/auth/register   → register
 *   POST   /api/auth/login      → login
 *   POST   /api/auth/logout     → logout
 *   GET    /api/auth/me         → getMe   (protected)
 */

const authService   = require('../services/authService');
const ApiResponse   = require('../utils/ApiResponse');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a safe user object to return in responses.
 * Excludes password (already stripped by toJSON transform in the model).
 *
 * @param {import('../models/userModel')} user
 * @returns {object}
 */
const formatUser = (user) => ({
  id:         user._id,
  fullName:   user.fullName,
  email:      user.email,
  avatar:     user.avatar,
  role:       user.role,
  isVerified: user.isVerified,
  createdAt:  user.createdAt,
});

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * Creates a new user account and returns a 201 response.
 * Does NOT issue a token on register — user must log in explicitly.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const register = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await authService.registerUser(fullName, email, password);

    res.status(201).json(
      new ApiResponse(201, { user: formatUser(user) }, 'Account created successfully')
    );
  } catch (error) {
    next(error);
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 *
 * Validates credentials, issues a JWT access token via HttpOnly cookie,
 * and returns user data + access token in the response body.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, accessToken } = await authService.loginUser(email, password);

    // Set the access token as a secure HttpOnly cookie
    res.cookie('accessToken', accessToken, authService.getTokenOptions());

    res.status(200).json(
      new ApiResponse(
        200,
        {
          user:        formatUser(user),
          accessToken, // Also returned in body for non-browser clients
        },
        'Logged in successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/logout
 *
 * Clears the HttpOnly cookie and returns a success message.
 * No authentication required — a logged-out user calling this is harmless.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.status(200).json(
      new ApiResponse(200, null, 'Logged out successfully')
    );
  } catch (error) {
    next(error);
  }
};

// ─── Get current user ─────────────────────────────────────────────────────────

/**
 * GET /api/auth/me
 *
 * Returns the authenticated user's profile.
 * Protected by the `protect` middleware — req.user is guaranteed to exist.
 *
 * @param {import('express').Request}      req
 * @param {import('express').Response}     res
 * @param {import('express').NextFunction} next
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    res.status(200).json(
      new ApiResponse(200, { user: formatUser(req.user) }, 'User fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  register,
  login,
  logout,
  getMe,
};
