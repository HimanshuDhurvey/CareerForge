'use strict';

/**
 * resumeModel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema for the Resume collection.
 * One active resume per user (enforced by unique index on `user`).
 */

const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema(
  {
    overallScore: { type: Number, default: null },
    atsScore:     { type: Number, default: null },
    summary:      { type: String, default: '' },
    strengths:    { type: [String], default: [] },
    weaknesses:   { type: [String], default: [] },
    suggestions:  { type: [String], default: [] },
    keywords: {
      matched: { type: [String], default: [] },
      missing: { type: [String], default: [] },
    },
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'User reference is required'],
      unique:   true,
    },

    originalName: {
      type:     String,
      required: true,
      trim:     true,
    },

    filename: {
      type:     String,
      required: true,
    },

    fileSize: {
      type:     Number,
      required: true,
    },

    mimeType: {
      type:    String,
      default: 'application/pdf',
    },

    path: {
      type:     String,
      required: true,
    },

    uploadedAt: {
      type:    Date,
      default: Date.now,
    },

    analysisStatus: {
      type:    String,
      enum:    ['pending', 'analysing', 'done', 'failed'],
      default: 'pending',
    },

    analysisResult: {
      type:    analysisResultSchema,
      default: null,
    },
  },
  { timestamps: true }
);

resumeSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.__v;
    return obj;
  },
});

const Resume = mongoose.model('Resume', resumeSchema);

module.exports = Resume;
