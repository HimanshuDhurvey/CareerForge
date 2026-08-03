'use strict';

/**
 * authService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Business logic layer for authentication.
 *
 * Controllers should call these functions and never touch the DB or JWT
 * directly — that logic lives here.
 *
 * Exported functions:
 *   registerUser(fullName, email, password)
 *   loginUser(email, password)
 *   generateTokens(userId)
 *   getTokenOptions()
 */

const jwt     = require('jsonwebtoken');
const User    = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const env     = require('../config/env');

// ─── Token generation ─────────────────────────────────────────────────────────

/**
 * Generates a signed JWT access token for the given user ID.
 *
 * @param {string} userId  Mongo ObjectId as string
 * @returns {string}       Signed JWT
 */
const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });

/**
 * Generates a signed JWT refresh token for the given user ID.
 *
 * @param {string} userId  Mongo ObjectId as string
 * @returns {string}       Signed JWT
 */
const generateRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });

/**
 * Returns the cookie options for the access token cookie.
 * httpOnly prevents JS access; secure is true in production only.
 *
 * @returns {import('express').CookieOptions}
 */
const getTokenOptions = () => ({
  httpOnly: true,
  secure:   env.isProduction,
  sameSite: 'lax',
  maxAge:   15 * 60 * 1000, // 15 minutes in milliseconds
});

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Creates a new user account.
 *
 * Steps:
 *   1. Check for duplicate email
 *   2. Create & save user (password hashed by pre-save hook)
 *   3. Return the saved user document (without password)
 *
 * @param {string} fullName
 * @param {string} email
 * @param {string} password  Plain text — hashed by the model pre-save hook
 * @returns {Promise<import('../models/userModel')>}  Saved user document
 */
const registerUser = async (fullName, email, password) => {
  // 1. Duplicate email check
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists');
  }

  // 2. Create user — password is hashed by the pre-save hook in userModel.js
  const user = await User.create({ fullName, email, password });

  return user;
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Validates credentials and returns the authenticated user + tokens.
 *
 * Steps:
 *   1. Find user by email (explicitly select password for comparison)
 *   2. Compare plain-text password against stored hash
 *   3. Generate access & refresh tokens
 *
 * @param {string} email
 * @param {string} password  Plain-text candidate password
 * @returns {Promise<{ user: object, accessToken: string, refreshToken: string }>}
 */
const loginUser = async (email, password) => {
  // 1. Find user — password is excluded by default, so we must .select('+password')
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    // Generic message prevents user-enumeration attacks
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2. Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Generate tokens
  const accessToken  = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  return { user, accessToken, refreshToken };
};

// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  registerUser,
  loginUser,
  generateAccessToken,
  getTokenOptions,
};
