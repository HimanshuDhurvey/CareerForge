'use strict';

/**
 * interviewRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for Interview Engine management endpoints.
 * All routes are protected via JWT authentication.
 */

const express             = require('express');
const interviewController = require('../controllers/interviewController');
const { protect }         = require('../middlewares/authMiddleware');
const {
  startInterviewRules,
  saveAnswerRules,
  updateInterviewRules,
  interviewIdParamRules,
} = require('../validators/interviewValidator');

const router = express.Router();

// Apply JWT authentication protection to all interview engine routes
router.use(protect);

/**
 * POST /api/interviews/start
 * Create and start a new intelligent interview session with balanced question selection.
 */
router.post('/start', startInterviewRules, interviewController.startInterview);

/**
 * GET /api/interviews/:id/question
 * Retrieve current question details for active session (without future questions).
 */
router.get('/:id/question', interviewIdParamRules, interviewController.getCurrentQuestion);

/**
 * POST /api/interviews/:id/answer
 * Save user answer for a specific question with duplicate submission prevention.
 */
router.post('/:id/answer', saveAnswerRules, interviewController.saveAnswer);

/**
 * POST /api/interviews/:id/next
 * Move session to next question or return completion notice.
 */
router.post('/:id/next', interviewIdParamRules, interviewController.nextQuestion);

/**
 * POST /api/interviews/:id/finish
 * Mark interview session as completed and ready for AI evaluation.
 */
router.post('/:id/finish', interviewIdParamRules, interviewController.finishInterview);

/**
 * GET /api/interviews
 * List paginated interview history for authenticated user (latest first).
 */
router.get('/', interviewController.getUserInterviews);

/**
 * GET /api/interviews/:id
 * Retrieve comprehensive details for a specific interview session (config, questions, answers).
 */
router.get('/:id', interviewIdParamRules, interviewController.getInterviewById);

/**
 * POST /api/interviews
 * Alias for start interview (backward compatibility).
 */
router.post('/', startInterviewRules, interviewController.startInterview);

/**
 * PATCH /api/interviews/:id
 * Legacy / Admin endpoint to update interview attributes directly.
 */
router.patch('/:id', updateInterviewRules, interviewController.updateInterview);

/**
 * DELETE /api/interviews/:id
 * Delete an interview session and all associated response records.
 */
router.delete('/:id', interviewIdParamRules, interviewController.deleteInterview);

module.exports = router;
