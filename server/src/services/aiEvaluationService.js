const Evaluation = require('../models/Evaluation');
const Interview = require('../models/Interview');
const InterviewResponse = require('../models/InterviewResponse');
const ApiError = require('../utils/ApiError');
const { evaluateInterviewWithGemini } = require('./geminiService');

/**
 * Generate AI evaluation for a completed interview session using Gemini API.
 * Prevents duplicate evaluation generation if one already exists.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview session ID
 * @returns {Promise<Object>} Evaluation document
 */
const generateEvaluation = async (userId, interviewId) => {
  // 1. Fetch interview session with populated questions
  const interview = await Interview.findOne({ _id: interviewId, user: userId })
    .populate({
      path: 'questions',
      select: 'question category difficulty interviewType expectedTopics keyPoints tags',
    })
    .lean();

  if (!interview) {
    throw new ApiError(404, 'Interview session not found or access denied');
  }

  // 2. Check if evaluation already exists for this interview
  const existingEval = await Evaluation.findOne({ interview: interviewId, user: userId }).lean();
  if (existingEval) {
    return existingEval;
  }

  // 3. Fetch candidate user answers
  const responses = await InterviewResponse.find({ interview: interview._id }).lean();

  // Create a quick lookup map by questionId string
  const responseMap = {};
  responses.forEach((r) => {
    if (r.questionId) {
      responseMap[r.questionId.toString()] = r;
    }
  });

  // 4. Map questions with candidate answers
  const questionsPayload = (interview.questions || []).map((q) => {
    const qIdStr = (q._id || q.id || '').toString();
    const resp = responseMap[qIdStr];

    return {
      id: qIdStr,
      question: q.question,
      category: q.category || 'General',
      difficulty: q.difficulty || interview.difficulty,
      expectedTopics: q.expectedTopics || [],
      keyPoints: q.keyPoints || [],
      userAnswer: resp ? resp.userAnswer : '',
      timeTaken: resp ? resp.timeTaken : 0,
    };
  });

  // 5. Build full payload for Gemini evaluation engine
  const evalPayload = {
    interviewTitle: interview.title,
    role: interview.role,
    difficulty: interview.difficulty,
    interviewType: interview.interviewType,
    duration: interview.duration,
    questions: questionsPayload,
  };

  // 6. Call Gemini API
  const aiResult = await evaluateInterviewWithGemini(evalPayload);

  // 7. Save evaluation result to Database separately
  const newEvaluation = await Evaluation.create({
    interview: interview._id,
    user: userId,
    overallScore: aiResult.overallScore,
    technicalScore: aiResult.technicalScore,
    communicationScore: aiResult.communicationScore,
    problemSolvingScore: aiResult.problemSolvingScore,
    strengths: aiResult.strengths,
    weaknesses: aiResult.weaknesses,
    overallFeedback: aiResult.overallFeedback,
    recommendations: aiResult.recommendations,
    questionAnalysis: aiResult.questionAnalysis,
    rawAiResponse: aiResult.rawText,
  });

  // 8. Update interview summary score & feedback without overwriting question data
  await Interview.updateOne(
    { _id: interview._id },
    {
      $set: {
        score: aiResult.overallScore,
        feedback: aiResult.overallFeedback,
        status: 'completed',
      },
    }
  );

  return newEvaluation;
};

/**
 * Retrieve stored AI evaluation report for an interview session.
 *
 * @param {string|ObjectId} userId - Authenticated user ID
 * @param {string} interviewId - Interview session ID
 * @returns {Promise<Object>} Evaluation document
 */
const getEvaluationByInterviewId = async (userId, interviewId) => {
  const evaluation = await Evaluation.findOne({ interview: interviewId, user: userId })
    .populate({
      path: 'interview',
      select: 'title role difficulty interviewType duration status startedAt completedAt questions',
    })
    .lean();

  if (!evaluation) {
    throw new ApiError(404, 'No AI evaluation report found for this interview session');
  }

  return evaluation;
};

module.exports = {
  generateEvaluation,
  getEvaluationByInterviewId,
};
