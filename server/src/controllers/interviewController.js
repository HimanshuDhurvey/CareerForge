'use strict';

/**
 * interviewController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Controller layer for Interview management endpoints.
 * Interacts with interviewService and formats standard HTTP responses.
 */

const interviewService = require('../services/interviewService');
const ApiResponse      = require('../utils/ApiResponse');

/**
 * POST /api/interviews
 * Create a new interview session.
 */
const createInterview = async (req, res, next) => {
  try {
    const interview = await interviewService.createInterview(req.user._id, req.body);

    res.status(201).json(
      new ApiResponse(201, interview, 'Interview session created successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/interviews
 * Fetch all interviews belonging to the authenticated user.
 */
const getUserInterviews = async (req, res, next) => {
  try {
    const interviews = await interviewService.getUserInterviews(req.user._id);

    res.status(200).json(
      new ApiResponse(200, interviews, 'Interviews retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/interviews/:id
 * Fetch detailed information for a specific interview.
 */
const getInterviewById = async (req, res, next) => {
  try {
    const interview = await interviewService.getInterviewById(req.user._id, req.params.id);

    res.status(200).json(
      new ApiResponse(200, interview, 'Interview details retrieved successfully')
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
    const updatedInterview = await interviewService.updateInterview(
      req.user._id,
      req.params.id,
      req.body
    );

    res.status(200).json(
      new ApiResponse(200, updatedInterview, 'Interview updated successfully')
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
    const result = await interviewService.deleteInterview(req.user._id, req.params.id);

    res.status(200).json(
      new ApiResponse(200, result, 'Interview session deleted successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getUserInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
