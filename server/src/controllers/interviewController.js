'use strict';

/**
 * interviewController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Controller layer for Interview Engine endpoints.
 * Interacts with interviewService and formats standardized HTTP responses.
 */

const interviewService = require('../services/interviewService');
const ApiResponse      = require('../utils/ApiResponse');

/**
 * POST /api/interviews/start
 * Create and start a new intelligent interview session.
 */
const startInterview = async (req, res, next) => {
  try {
    const session = await interviewService.startInterview(req.user._id, req.body);

    res.status(201).json(
      new ApiResponse(201, session, 'Interview session created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/interviews/:id/question
 * Retrieve current question and delivery state for an active interview session.
 */
const getCurrentQuestion = async (req, res, next) => {
  try {
    const questionData = await interviewService.getCurrentQuestion(
      req.user._id,
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, questionData, 'Current question fetched successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/interviews/:id/answer
 * Save candidate answer for a specific question with duplicate prevention.
 */
const saveAnswer = async (req, res, next) => {
  try {
    const response = await interviewService.saveAnswer(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json(
      new ApiResponse(200, response, 'Answer saved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/interviews/:id/next
 * Move to next question or notify interview completion.
 */
const nextQuestion = async (req, res, next) => {
  try {
    const result = await interviewService.nextQuestion(
      req.user._id,
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, result, 'Advanced to next question state successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/interviews/:id/finish
 * Mark interview completed and prepare data for AI evaluation.
 */
const finishInterview = async (req, res, next) => {
  try {
    const result = await interviewService.finishInterview(
      req.user._id,
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, result, 'Interview session finished successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/interviews
 * List paginated interview history for the authenticated user (latest first).
 */
const getUserInterviews = async (req, res, next) => {
  try {
    const history = await interviewService.getUserInterviews(
      req.user._id,
      req.query
    );

    res.status(200).json(
      new ApiResponse(200, history, 'Interview history retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/interviews/:id
 * Retrieve full details for a specific interview session (config, questions, answers).
 */
const getInterviewById = async (req, res, next) => {
  try {
    const details = await interviewService.getInterviewById(
      req.user._id,
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, details, 'Interview details retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/interviews/:id
 * Update status, progress, timing, score, or feedback of an interview session.
 */
const updateInterview = async (req, res, next) => {
  try {
    const updated = await interviewService.updateInterview(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json(
      new ApiResponse(200, updated, 'Interview session updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/interviews/:id
 * Delete an interview session along with all associated response records.
 */
const deleteInterview = async (req, res, next) => {
  try {
    const result = await interviewService.deleteInterview(
      req.user._id,
      req.params.id
    );

    res.status(200).json(
      new ApiResponse(200, result, 'Interview session deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startInterview,
  createInterview: startInterview, // Backward compatibility alias
  getCurrentQuestion,
  saveAnswer,
  nextQuestion,
  finishInterview,
  getUserInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
