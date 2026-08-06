'use strict';

/**
 * interviewService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service layer for Interview Engine operations.
 * Handles database logic and business rules for interview creation, question delivery,
 * answer saving, progression, session termination, and history retrieval.
 */

const Interview              = require('../models/Interview');
const InterviewResponse      = require('../models/InterviewResponse');
const Question               = require('../models/Question');
const ApiError               = require('../utils/ApiError');
const questionSelectionService = require('./questionSelectionService');

/**
 * Format interview document into a standard response object.
 *
 * @param {Object} interview - Interview Mongoose document
 * @param {number} responsesCount - Number of submitted responses
 * @returns {Object} Formatted interview object
 */
const formatInterviewSummary = (interview, responsesCount = 0) => {
  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    role: interview.role,
    difficulty: interview.difficulty,
    interviewType: interview.interviewType,
    category: interview.category || 'General',
    totalQuestions: interview.totalQuestions,
    currentQuestionIndex: interview.currentQuestionIndex,
    duration: interview.duration,
    responsesCount,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
    createdAt: interview.createdAt,
    updatedAt: interview.updatedAt,
  };
};

/**
 * Start a new interview session.
 * Selects questions intelligently using the Question Selection Service,
 * creates an Interview document storing Question ObjectIds only, and initializes session progress.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {Object} payload - Session configuration
 * @param {string} payload.role - Job role
 * @param {string} payload.difficulty - Easy, Medium, Hard
 * @param {string} payload.interviewType - Technical, HR, Behavioral, Mixed
 * @param {number} [payload.numberOfQuestions=10] - Number of questions
 * @returns {Promise<Object>} Created interview session summary
 */
const startInterview = async (userId, payload) => {
  const { role, difficulty, interviewType, numberOfQuestions = 10, title } = payload;

  const targetCount = Math.max(1, Number(numberOfQuestions) || 10);

  // 1. Intelligent Question Selection
  const selectedQuestions = await questionSelectionService.selectQuestions({
    role,
    difficulty,
    interviewType,
    numberOfQuestions: targetCount,
  });

  const questionIds = selectedQuestions.map((q) => q._id);

  // Calculate estimated duration in minutes (sum of questions' estimatedTime in seconds / 60)
  const totalEstSeconds = selectedQuestions.reduce(
    (sum, q) => sum + (q.estimatedTime || 120),
    0
  );
  const estimatedDurationMinutes = Math.max(1, Math.ceil(totalEstSeconds / 60));

  const sessionTitle =
    title || `${role} - ${interviewType} (${difficulty}) Interview`;

  // Determine primary category from selected questions
  const primaryCategory =
    selectedQuestions.length > 0 ? selectedQuestions[0].category : 'General';

  // 2. Create Interview Document (Stores Question ObjectIds ONLY)
  const interview = await Interview.create({
    user: userId,
    title: sessionTitle,
    role,
    category: primaryCategory,
    difficulty,
    interviewType,
    totalQuestions: questionIds.length,
    duration: estimatedDurationMinutes,
    questions: questionIds,
    currentQuestionIndex: 0,
    status: 'in_progress',
    startedAt: new Date(),
    score: 0,
    feedback: '',
  });

  return {
    id: interview._id,
    title: interview.title,
    role: interview.role,
    difficulty: interview.difficulty,
    interviewType: interview.interviewType,
    totalQuestions: interview.totalQuestions,
    duration: interview.duration,
    currentQuestionIndex: 0,
    status: interview.status,
    startedAt: interview.startedAt,
  };
};

/**
 * Get current question delivery for an active interview session.
 * Guarantees that future questions are NOT disclosed.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Current question details and progress metadata
 */
const getCurrentQuestion = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  if (interview.status === 'completed') {
    throw new ApiError(400, 'Interview is already completed');
  }

  if (interview.status === 'cancelled') {
    throw new ApiError(400, 'Interview session was cancelled');
  }

  const currentIndex = interview.currentQuestionIndex;

  if (currentIndex >= interview.questions.length) {
    return {
      isFinished: true,
      message: 'Interview Finished.',
      questionNumber: interview.questions.length,
      totalQuestions: interview.totalQuestions,
    };
  }

  const currentQuestionId = interview.questions[currentIndex];

  const questionDoc = await Question.findById(currentQuestionId).lean();

  if (!questionDoc) {
    throw new ApiError(404, 'Question object not found in database');
  }

  // Calculate remaining session time in seconds
  let remainingTime = (questionDoc.estimatedTime || 120);
  if (interview.startedAt) {
    const elapsedSeconds = Math.floor((Date.now() - new Date(interview.startedAt).getTime()) / 1000);
    const totalAllowedSeconds = interview.duration * 60;
    remainingTime = Math.max(0, totalAllowedSeconds - elapsedSeconds);
  }

  return {
    currentQuestion: {
      id: questionDoc._id,
      question: questionDoc.question,
      category: questionDoc.category,
      difficulty: questionDoc.difficulty,
      interviewType: questionDoc.interviewType,
      estimatedTime: questionDoc.estimatedTime,
      expectedTopics: questionDoc.expectedTopics || [],
      keyPoints: questionDoc.keyPoints || [],
      tags: questionDoc.tags || [],
    },
    questionNumber: currentIndex + 1,
    totalQuestions: interview.totalQuestions,
    remainingTime,
  };
};

/**
 * Save candidate answer for a specific question in an interview session.
 * Prevents answer overwriting and duplicate submissions.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview document ID
 * @param {Object} answerData - { questionId, answer, timeTaken }
 * @returns {Promise<Object>} Saved answer metadata
 */
const saveAnswer = async (userId, interviewId, answerData) => {
  const { questionId, answer, timeTaken = 0 } = answerData;

  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  if (interview.status === 'completed') {
    throw new ApiError(400, 'Interview is already completed');
  }

  // Validate question belongs to this interview session
  const isQuestionInSession = interview.questions.some(
    (qId) => qId.toString() === questionId.toString()
  );

  if (!isQuestionInSession) {
    throw new ApiError(400, 'Question does not belong to this interview session');
  }

  // Prevent duplicate submissions / answer overwriting
  const existingResponse = await InterviewResponse.findOne({
    interview: interview._id,
    questionId: questionId,
  });

  if (existingResponse) {
    throw new ApiError(400, 'Answer already submitted for this question');
  }

  // Fetch question document to capture question text
  const questionDoc = await Question.findById(questionId).lean();
  const questionText = questionDoc ? questionDoc.question : 'Question Text Unavailable';

  // Create InterviewResponse document
  const responseDoc = await InterviewResponse.create({
    interview: interview._id,
    questionId: questionId,
    questionText,
    userAnswer: answer.trim(),
    timeTaken: Number(timeTaken) || 0,
  });

  return {
    responseId: responseDoc._id,
    interviewId: interview._id,
    questionId: responseDoc.questionId,
    userAnswer: responseDoc.userAnswer,
    timeTaken: responseDoc.timeTaken,
    submittedAt: responseDoc.createdAt,
  };
};

/**
 * Advance interview session to the next question.
 * Returns next question or indicates interview completion.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Next question payload or completion message
 */
const nextQuestion = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  if (interview.status === 'completed') {
    throw new ApiError(400, 'Interview is already completed');
  }

  // Advance question index
  interview.currentQuestionIndex += 1;
  await interview.save();

  // If last question exceeded, return completion signal
  if (interview.currentQuestionIndex >= interview.questions.length) {
    return {
      isFinished: true,
      message: 'Interview Finished.',
      currentQuestionIndex: interview.currentQuestionIndex,
      totalQuestions: interview.totalQuestions,
    };
  }

  // Fetch next question details
  return getCurrentQuestion(userId, interviewId);
};

/**
 * Complete an interview session.
 * Marks interview as completed and sets finished metrics.
 * Session is now ready for Phase 6.6 AI evaluation.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Completed interview status payload
 */
const finishInterview = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  if (interview.status === 'completed') {
    throw new ApiError(400, 'Interview is already completed');
  }

  const completedAt = new Date();
  let elapsedMinutes = interview.duration;

  if (interview.startedAt) {
    const elapsedMs = completedAt.getTime() - new Date(interview.startedAt).getTime();
    elapsedMinutes = Math.max(1, Math.round(elapsedMs / (1000 * 60)));
  }

  interview.status = 'completed';
  interview.completedAt = completedAt;
  interview.duration = elapsedMinutes;

  await interview.save();

  const responsesCount = await InterviewResponse.countDocuments({
    interview: interview._id,
  });

  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    role: interview.role,
    difficulty: interview.difficulty,
    interviewType: interview.interviewType,
    totalQuestions: interview.totalQuestions,
    answeredQuestions: responsesCount,
    durationMinutes: interview.duration,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
    readyForAIEvaluation: true,
  };
};

/**
 * Get interview history for authenticated user with pagination support.
 * Sorted by latest first (createdAt: -1).
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {Object} queryParams - { page, limit }
 * @returns {Promise<Object>} Paginated list of interviews
 */
const getUserInterviews = async (userId, queryParams = {}) => {
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(queryParams.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const total = await Interview.countDocuments({ user: userId });

  const interviews = await Interview.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const formattedItems = interviews.map((item) => ({
    id: item._id,
    title: item.title,
    role: item.role,
    category: item.category || 'General',
    interviewType: item.interviewType,
    difficulty: item.difficulty,
    status: item.status,
    score: item.score,
    duration: item.duration,
    totalQuestions: item.totalQuestions,
    currentQuestionIndex: item.currentQuestionIndex,
    startedAt: item.startedAt,
    completedAt: item.completedAt,
    createdAt: item.createdAt,
  }));

  return {
    interviews: formattedItems,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Get detailed interview session document with populated questions and user responses.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview document ID
 * @returns {Promise<Object>} Complete interview details object
 */
const getInterviewById = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId })
    .populate({
      path: 'questions',
      select: 'question category difficulty interviewType estimatedTime expectedTopics keyPoints tags',
    })
    .lean();

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  const responses = await InterviewResponse.find({ interview: interview._id })
    .sort({ createdAt: 1 })
    .lean();

  const formattedResponses = responses.map((r) => ({
    id: r._id,
    questionId: r.questionId,
    questionText: r.questionText,
    userAnswer: r.userAnswer,
    timeTaken: r.timeTaken,
    aiScore: r.aiScore,
    aiFeedback: r.aiFeedback,
    submittedAt: r.createdAt,
  }));

  return {
    id: interview._id,
    title: interview.title,
    status: interview.status,
    configuration: {
      role: interview.role,
      category: interview.category || 'General',
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
    questions: interview.questions || [],
    userAnswers: formattedResponses,
    duration: interview.duration,
    startedAt: interview.startedAt,
    completedAt: interview.completedAt,
    score: interview.score,
    feedback: interview.feedback,
    createdAt: interview.createdAt,
    updatedAt: interview.updatedAt,
  };
};

/**
 * Backward compatible create interview logic.
 */
const createInterview = async (userId, payload) => {
  return startInterview(userId, payload);
};

/**
 * Update interview document.
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
  return formatInterviewSummary(interview);
};

/**
 * Delete an interview session and its responses.
 */
const deleteInterview = async (userId, interviewId) => {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });

  if (!interview) {
    throw new ApiError(404, 'Interview session not found');
  }

  const responseDeleteResult = await InterviewResponse.deleteMany({
    interview: interview._id,
  });

  await interview.deleteOne();

  return {
    id: interviewId,
    deletedResponsesCount: responseDeleteResult.deletedCount || 0,
  };
};

module.exports = {
  startInterview,
  getCurrentQuestion,
  saveAnswer,
  nextQuestion,
  finishInterview,
  getUserInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
};
