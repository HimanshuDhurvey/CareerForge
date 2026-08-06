'use strict';

/**
 * Roadmap.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for storing AI-generated Career Roadmaps.
 */

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      trim: true,
      enum: ['Documentation', 'Video', 'Practice', 'Documentation | Video | Practice', 'Course', 'Article', 'Other'],
      default: 'Documentation',
    },
  },
  { _id: false }
);

const weeklyPlanSchema = new mongoose.Schema(
  {
    week: {
      type: Number,
      required: true,
    },
    stage: {
      type: String,
      trim: true,
      default: 'Stage 1: Core Fundamentals',
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    whyItMatters: {
      type: String,
      trim: true,
      default: '',
    },
    aiTips: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      trim: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    resources: [resourceSchema],
    miniProject: {
      type: String,
      trim: true,
      default: '',
    },
    estimatedHours: {
      type: Number,
      default: 10,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    careerGoal: {
      type: String,
      trim: true,
      required: true,
    },
    currentLevel: {
      type: String,
      trim: true,
      default: 'Intermediate',
    },
    careerReadiness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    estimatedDuration: {
      type: String,
      trim: true,
      default: '8 Weeks',
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    prioritySkills: [
      {
        type: String,
        trim: true,
      },
    ],
    recommendedProjects: [
      {
        type: String,
        trim: true,
      },
    ],
    recommendedCertifications: [
      {
        type: String,
        trim: true,
      },
    ],
    weeklyPlan: [weeklyPlanSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
