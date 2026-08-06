const ApiResponse = require('../utils/ApiResponse');
const aiEvaluationService = require('../services/aiEvaluationService');

/**
 * @desc    Generate Gemini AI Evaluation for an interview session
 * @route   POST /api/ai/evaluate/:interviewId
 * @access  Private
 */
const generateEvaluationController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { interviewId } = req.params;

    const evaluation = await aiEvaluationService.generateEvaluation(userId, interviewId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          evaluation,
          'AI Evaluation report generated successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stored AI Evaluation report for an interview session
 * @route   GET /api/ai/evaluation/:interviewId
 * @access  Private
 */
const getEvaluationController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { interviewId } = req.params;

    const evaluation = await aiEvaluationService.getEvaluationByInterviewId(userId, interviewId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          evaluation,
          'AI Evaluation report retrieved successfully'
        )
      );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateEvaluationController,
  getEvaluationController,
};
