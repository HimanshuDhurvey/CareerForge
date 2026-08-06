const mongoose = require('mongoose');

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
      index: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    formattingScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    contentScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    skillsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    projectsScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    experienceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    educationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    grammarScore: {
      type: Number,
      min: 0,
      max: 100,
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
    missingKeywords: [
      {
        type: String,
      },
    ],
    recommendedSkills: [
      {
        type: String,
      },
    ],
    recommendedProjects: [
      {
        type: String,
      },
    ],
    atsIssues: [
      {
        type: String,
      },
    ],
    improvementSuggestions: [
      {
        type: String,
      },
    ],
    summary: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'analysing', 'completed', 'failed'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);

module.exports = ResumeAnalysis;
