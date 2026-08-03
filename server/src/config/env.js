'use strict';

/**
 * env.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized environment variable validation.
 *
 * This module reads, validates, and exports every environment variable the
 * application depends on.  It is imported once in server.js (after dotenv
 * has been loaded) so the process fails fast with a descriptive error if a
 * required variable is missing.
 *
 * Usage:
 *   const env = require('./config/env');
 *   console.log(env.PORT, env.MONGO_URI);
 */

const logger = require('../utils/logger');

// ─── Required variables ───────────────────────────────────────────────────────

const REQUIRED = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

// ─── Validate ─────────────────────────────────────────────────────────────────

const missing = REQUIRED.filter((key) => !process.env[key]);

if (missing.length > 0) {
  logger.error(
    `Missing required environment variables: ${missing.join(', ')}\n` +
    'Please check your .env file and try again.'
  );
  process.exit(1);
}

// ─── Exports ──────────────────────────────────────────────────────────────────

const env = {
  /** Runtime environment: 'development' | 'production' | 'test' */
  NODE_ENV: process.env.NODE_ENV || 'development',

  /** HTTP port the server listens on */
  PORT: parseInt(process.env.PORT, 10) || 5000,

  /** Full MongoDB connection string */
  MONGO_URI: process.env.MONGO_URI,

  /** Allowed CORS origin (frontend URL) */
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  /** JWT access token secret */
  JWT_ACCESS_SECRET:   process.env.JWT_ACCESS_SECRET,

  /** JWT refresh token secret */
  JWT_REFRESH_SECRET:  process.env.JWT_REFRESH_SECRET,

  /** JWT access token expiry (e.g. '15m') */
  JWT_ACCESS_EXPIRES_IN:  process.env.JWT_ACCESS_EXPIRES_IN  || '15m',

  /** JWT refresh token expiry (e.g. '7d') */
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  /** Convenience helpers */
  isDevelopment: (process.env.NODE_ENV || 'development') === 'development',
  isProduction:  process.env.NODE_ENV === 'production',
  isTest:        process.env.NODE_ENV === 'test',
};

module.exports = env;
