'use strict';

/**
 * Question.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for the Question collection.
 * Holds scalable question bank items for interview sessions.
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
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
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    expectedTopics: {
      type: [String],
      default: [],
    },
    keyPoints: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    estimatedTime: {
      type: Number,
      default: 120, // default 120 seconds
      min: [0, 'Estimated time cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.__v;
    return obj;
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
