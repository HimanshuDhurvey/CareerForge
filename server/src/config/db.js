'use strict';

/**
 * db.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose connection manager.
 *
 * Exports a single `connectDB()` function that establishes the MongoDB
 * connection and wires up lifecycle event listeners.
 *
 * Usage:
 *   const connectDB = require('./config/db');
 *   await connectDB();
 */

const mongoose = require('mongoose');
const logger   = require('../utils/logger');

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Exits the process if the initial connection fails.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 7+ does not require these flags but they are harmless
      // Remove if using Mongoose < 6
    });

    logger.info(`MongoDB connected → ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB initial connection failed', error);
    process.exit(1); // Non-recoverable — exit so the process manager can restart
  }
};

// ─── Connection lifecycle events ──────────────────────────────────────────────

mongoose.connection.on('connected', () => {
  logger.info('Mongoose default connection established');
});

mongoose.connection.on('error', (err) => {
  logger.error('Mongoose connection error', err);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose connection lost');
});

// ─── Graceful disconnect on process termination ───────────────────────────────

const gracefulDisconnect = async (signal) => {
  await mongoose.connection.close();
  logger.info(`Mongoose connection closed (${signal})`);
};

process.on('SIGINT',  () => gracefulDisconnect('SIGINT'));
process.on('SIGTERM', () => gracefulDisconnect('SIGTERM'));

module.exports = connectDB;
