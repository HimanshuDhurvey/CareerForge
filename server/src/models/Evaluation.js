const mongoose = require('mongoose');

const questionAnalysisSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      required: true,
    },
    questionText: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    strengths: [
      {
        type: String,
      },
    ],
    improvements: [
      {
        type: String,
      },
    ],
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    technicalScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    communicationScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    problemSolvingScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 0,
    },
    strengths: [
      {
        type: String,
      },
    ],
    weaknesses: [
      {
        type: String,
      },
    ],
    overallFeedback: {
      type: String,
      default: '',
    },
    recommendations: [
      {
        type: String,
      },
    ],
    questionAnalysis: [questionAnalysisSchema],
    rawAiResponse: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation;
