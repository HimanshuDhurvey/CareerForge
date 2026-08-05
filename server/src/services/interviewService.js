'use strict';

/**
 * interviewService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service layer for Interview operations.
 * Handles database logic and business rules for interview management.
 */

const Interview         = require('../models/Interview');
const InterviewResponse = require('../models/InterviewResponse');
const ApiError          = require('../utils/ApiError');

/**
 * Helper to format interview document into standard details shape.
 *
 * @param {Object} interview - Interview Mongoose document
 * @param {number} responsesCount - Count of associated InterviewResponse documents
 * @returns {Object} Clean interview details object
 */
const formatInterviewDetails = (interview, responsesCount = 0) => {
  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    duration: interview.duration,
    configuration: {
      role: interview.role,
      category: interview.category,
      difficulty: interview.difficulty,
      interviewType: interview.interviewType,
      totalQuestions: interview.totalQuestions,
      duration: interview.duration,
    },
    progress: {
      currentQuestionIndex: interview.currentQuestionIndex,
      totalQuestions: interview.totalQuestions,
      status: interview.status,
    },
    responsesCount,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
    score: interview.score,
    feedback: interview.feedback,
    createdAt: interview.createdAt,
    updatedAt: interview.updatedAt,
  };
};

/**
 * Create a new interview session.
 *
 * @param {string|ObjectId} userId - Authenticated user's ID
 * @param {Object} payload - Interview creation data
 * @returns {Promise<Object>} Created interview session details
 */
const createInterview = async (userId, payload) => {
  const {
    role,
    category,
    difficulty,
    interviewType,
    totalQuestions,
    duration,
    title,
  } = payload;

  const sessionTitle = title || `${role} - ${interviewType} Interview`;

  const interview = await Interview.create({
    user: userId,
    title: sessionTitle,
    role,
    category,
    difficulty,
    interviewType,
    totalQuestions: Number(totalQuestions),
    duration: Number(duration),
    currentQuestionIndex: 0,
    status: 'pending',
    score: 0,
    feedback: '',
  });

  return formatInterviewDetails(interview, 0);
};

/**
 * Fetch all interviews belonging to a user.
 *
 * @param {string|ObjectId} userId - Authenticated user's ID
 * @returns {Promise<Array<Object>>} Array of user interviews summary
 */
const getUserInterviews = async (userId) => {
  const interviews = await Interview.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return interviews.map((item) => ({
    id: item._id,
    title: item.title,
    role: item.role,
    category: item.category,
    interviewType: item.interviewType,
    difficulty: item.difficulty,
    status: item.status,
    score: item.score,
    duration: item.duration,
    totalQuestions: item.totalQuestions,
    currentQuestionIndex: item.currentQuestionIndex,
    createdAt: item.createdAt,
  }));
};

/**
 * Get details of a single interview session.
 *
 * @param {string|ObjectId} userId - Authenticated user's ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Detailed interview object
 */
const getInterviewById = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  const responsesCount = await InterviewResponse.countDocuments({
    interview: interview._id,
  });

  return formatInterviewDetails(interview, responsesCount);
};

/**
 * Update an existing interview session.
 *
 * @param {string|ObjectId} userId - Authenticated user's ID
 * @param {string} interviewId - Interview document ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} Updated interview object
 */
const updateInterview = async (userId, interviewId, updateData) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  const allowedUpdates = [
    'status',
    'currentQuestionIndex',
    'startedAt',
    'completedAt',
    'score',
    'feedback',
    'title',
  ];

  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      interview[field] = updateData[field];
    }
  });

  await interview.save();

  const responsesCount = await InterviewResponse.countDocuments({
    interview: interview._id,
  });

  return formatInterviewDetails(interview, responsesCount);
};

/**
 * Delete an interview session and all associated response records.
 *
 * @param {string|ObjectId} userId - Authenticated user's ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Summary of deleted records
 */
const deleteInterview = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  // Delete all InterviewResponse documents associated with this interview
  const responseDeleteResult = await InterviewResponse.deleteMany({
    interview: interview._id,
  });

  // Delete the Interview document
  await interview.deleteOne();

  return {
    id: interviewId,
    deletedResponsesCount: responseDeleteResult.deletedCount || 0,
  };
};

module.exports = {
  createInterview,
  getUserInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};
