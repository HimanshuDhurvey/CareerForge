'use strict';

/**
 * profileModel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for the Profile collection.
 * Holds all career details and social profiles of a user.
 */

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    college: {
      type: String,
      trim: true,
      default: '',
    },

    degree: {
      type: String,
      trim: true,
      default: '',
    },

    branch: {
      type: String,
      trim: true,
      default: '',
    },

    graduationYear: {
      type: Number,
      default: null,
    },

    targetRole: {
      type: String,
      trim: true,
      default: '',
    },

    targetCompany: {
      type: String,
      trim: true,
      default: '',
    },

    skills: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      trim: true,
      default: '',
    },

    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },

    linkedinUrl: {
      type: String,
      trim: true,
      default: '',
    },

    portfolioUrl: {
      type: String,
      trim: true,
      default: '',
    },

    location: {
      type: String,
      trim: true,
      default: '',
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// toJSON transform: strip Mongoose internals
profileSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.__v;
    return obj;
  },
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
