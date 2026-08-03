'use strict';

/**
 * logger.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight, production-ready console logger.
 *
 * Usage:
 *   const logger = require('../utils/logger');
 *   logger.info('Server started');
 *   logger.error('Something broke', err);
 *
 * In production, replace this module with a proper logger (e.g. Winston,
 * Pino) without changing any call-sites.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/**
 * Returns an ISO timestamp string.
 * @returns {string}
 */
const timestamp = () => new Date().toISOString();

/**
 * Formats a log line with timestamp, level, and message.
 * @param {string} level
 * @param {string} message
 * @returns {string}
 */
const format = (level, message) => `[${timestamp()}] [${level}] ${message}`;

const logger = {
  /**
   * Log general info messages.
   * @param {string} message
   */
  info: (message) => {
    console.log(format('INFO', message));
  },

  /**
   * Log warning messages.
   * @param {string} message
   */
  warn: (message) => {
    console.warn(format('WARN', message));
  },

  /**
   * Log error messages. Accepts an optional Error object for stack traces.
   * Stack traces are suppressed in production.
   * @param {string} message
   * @param {Error} [error]
   */
  error: (message, error) => {
    console.error(format('ERROR', message));
    if (error && !IS_PRODUCTION) {
      console.error(error.stack || error);
    }
  },

  /**
   * Log debug messages. Suppressed in production.
   * @param {string} message
   */
  debug: (message) => {
    if (!IS_PRODUCTION) {
      console.log(format('DEBUG', message));
    }
  },

  /**
   * Log a successful server-start summary.
   * @param {number|string} port
   * @param {string} env
   */
  serverStart: (port, env) => {
    console.log('');
    console.log('  ╔══════════════════════════════════════╗');
    console.log('  ║     CareerForge  API  Server          ║');
    console.log('  ╠══════════════════════════════════════╣');
    console.log(`  ║  ENV  : ${env.padEnd(28)}║`);
    console.log(`  ║  PORT : ${String(port).padEnd(28)}║`);
    console.log(`  ║  TIME : ${timestamp().padEnd(28)}║`);
    console.log('  ╚══════════════════════════════════════╝');
    console.log('');
  },
};

module.exports = logger;
