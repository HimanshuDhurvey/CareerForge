'use strict';

/**
 * interviewRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for Interview management endpoints.
 * All routes are protected via JWT authentication.
 */

const express           = require('express');
const interviewController = require('../controllers/interviewController');
const { protect }       = require('../middlewares/authMiddleware');
const {
  createInterviewRules,
  updateInterviewRules,
  interviewIdParamRules,
} = require('../validators/interviewValidator');

const router = express.Router();

// Apply JWT authentication protection to all interview routes
router.use(protect);

/**
 * POST /api/interviews
 * Create a new interview session
 */
router.post('/', createInterviewRules, interviewController.createInterview);

/**
 * GET /api/interviews
 * List all interviews for the authenticated user
 */
router.get('/', interviewController.getUserInterviews);

/**
 * GET /api/interviews/:id
 * Retrieve details for a specific interview
 */
router.get('/:id', interviewIdParamRules, interviewController.getInterviewById);

/**
 * PATCH /api/interviews/:id
 * Update interview status, current question index, timing, score, or feedback
 */
router.patch('/:id', updateInterviewRules, interviewController.updateInterview);

/**
 * DELETE /api/interviews/:id
 * Delete an interview and all associated response records
 */
router.delete('/:id', interviewIdParamRules, interviewController.deleteInterview);

module.exports = router;
