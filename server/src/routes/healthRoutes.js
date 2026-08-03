'use strict';

/**
 * healthRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Health check endpoint.
 *
 * GET /api/health
 *
 * Used by load balancers, Docker health checks, and monitoring services
 * to verify that the API is running and reachable.
 */

const express     = require('express');
const ApiResponse = require('../utils/ApiResponse');

const router = express.Router();

/**
 * GET /api/health
 * Returns server status, uptime, and environment.
 */
router.get('/', (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      timestamp: new Date().toISOString(),
      uptime:    `${Math.floor(process.uptime())}s`,
      env:       process.env.NODE_ENV || 'development',
    }, 'CareerForge Backend Running')
  );
});

module.exports = router;
