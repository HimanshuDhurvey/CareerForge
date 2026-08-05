'use strict';

/**
 * InterviewResponse.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for the InterviewResponse collection.
 * Each document represents one answered question within an interview session.
 */

const mongoose = require('mongoose');

const interviewResponseSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview',
      required: [true, 'Interview ID is required'],
      index: true,
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      default: null,
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    userAnswer: {
      type: String,
      default: '',
      trim: true,
    },
    answerType: {
      type: String,
      enum: {
        values: ['text'],
        message: '{VALUE} is not a valid answer type',
      },
      default: 'text',
    },
    timeTaken: {
      type: Number,
      default: 0,
      min: [0, 'Time taken cannot be negative'],
    },
    aiScore: {
      type: Number,
      default: null,
    },
    aiFeedback: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

interviewResponseSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.__v;
    return obj;
  },
});

const InterviewResponse = mongoose.model('InterviewResponse', interviewResponseSchema);

module.exports = InterviewResponse;
