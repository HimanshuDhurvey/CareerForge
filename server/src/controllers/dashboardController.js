'use strict';

/**
 * dashboardController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express controller for serving aggregated dashboard data via single GET endpoint.
 */

const dashboardService = require('../services/dashboardService');
const ApiResponse       = require('../utils/ApiResponse');

/**
 * GET /api/dashboard
 * Returns aggregated dashboard data for the authenticated user.
 */
const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const dashboardData = await dashboardService.getDashboardData(userId);
    res.status(200).json(
      new ApiResponse(200, dashboardData, 'Dashboard data retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardData,
};
