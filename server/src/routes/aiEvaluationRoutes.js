const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validateInterviewIdParam } = require('../validators/aiEvaluationValidator');
const {
  generateEvaluationController,
  getEvaluationController,
} = require('../controllers/aiEvaluationController');

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   POST /api/ai/evaluate/:interviewId
 * @desc    Generate Gemini AI Evaluation report for an interview
 * @access  Private
 */
router.post('/evaluate/:interviewId', validateInterviewIdParam, generateEvaluationController);

/**
 * @route   GET /api/ai/evaluation/:interviewId
 * @desc    Fetch stored AI Evaluation report for an interview
 * @access  Private
 */
router.get('/evaluation/:interviewId', validateInterviewIdParam, getEvaluationController);

module.exports = router;
