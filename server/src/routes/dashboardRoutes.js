'use strict';

/**
 * dashboardRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Route definitions for Dashboard API.
 * Protected with protect middleware.
 */

const express             = require('express');
const router              = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect }         = require('../middlewares/authMiddleware');

// GET /api/dashboard — aggregated dashboard payload
router.get('/', protect, dashboardController.getDashboardData);

module.exports = router;
