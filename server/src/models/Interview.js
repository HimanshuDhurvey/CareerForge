'use strict';

/**
 * Interview.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for the Interview collection.
 * Represents an interview session created by a user.
 */

const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Interview title is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    interviewType: {
      type: String,
      required: [true, 'Interview type is required'],
      enum: {
        values: ['Technical', 'HR', 'Behavioral', 'Mixed'],
        message: '{VALUE} is not a valid interview type',
      },
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
      trim: true,
    },
    totalQuestions: {
      type: Number,
      required: [true, 'Total questions is required'],
      min: [1, 'Total questions must be at least 1'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
      min: [0, 'Current question index cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'in_progress', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be less than 0'],
    },
    feedback: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

interviewSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.__v;
    return obj;
  },
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;
