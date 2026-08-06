'use strict';

/**
 * server.js — CareerForge Server Entry Point (Updated with Roadmap Routes)
 * ─────────────────────────────────────────────────────────────────────────────
 * Application entry point.
 *
 * Responsibilities:
 *   1. Load environment variables (must be first)
 *   2. Validate required env vars
 *   3. Connect to MongoDB
 *   4. Start the HTTP server
 *   5. Register graceful shutdown handlers
 *   6. Catch unhandled rejections & exceptions
 */

// ─── 1. Load .env ─────────────────────────────────────────────────────────────

require('dotenv').config();

// ─── 2. Validate env vars ─────────────────────────────────────────────────────

const env = require('./config/env');   // exits process if required vars missing
const logger = require('./utils/logger');

// ─── 3. Connect to MongoDB ────────────────────────────────────────────────────

const connectDB = require('./config/db');

// ─── 4. Import app ───────────────────────────────────────────────────────────

const app = require('./app');

// ─── 5. Start server ──────────────────────────────────────────────────────────

let server;

const startServer = async () => {
  try {
    // Establish database connection before accepting traffic
    await connectDB();

    server = app.listen(env.PORT, () => {
      logger.serverStart(env.PORT, env.NODE_ENV);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// ─── 6. Graceful shutdown ─────────────────────────────────────────────────────

/**
 * Closes the HTTP server gracefully, allowing in-flight requests to complete
 * before the process exits.
 * @param {string} signal
 */
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully…`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force exit after 10 s if connections don't drain
    setTimeout(() => {
      logger.warn('Forcing exit after timeout');
      process.exit(1);
    }, 10_000).unref();
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── 7. Safety nets ──────────────────────────────────────────────────────────

/**
 * Unhandled Promise rejections — log and exit so the process manager restarts.
 */
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection', reason);
  gracefulShutdown('unhandledRejection');
});

/**
 * Uncaught synchronous exceptions — log and exit.
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  gracefulShutdown('uncaughtException');
});
