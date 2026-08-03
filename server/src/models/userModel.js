'use strict';

/**
 * userModel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Mongoose schema and model for the User collection.
 *
 * Responsibilities:
 *   - Define the User document shape
 *   - Hash the password before save (pre-save hook)
 *   - Expose a comparePassword() instance method
 *   - Strip sensitive fields from JSON output
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type:     String,
      required: [true, 'Full name is required'],
      trim:     true,
      minlength: [2,  'Full name must be at least 2 characters'],
      maxlength: [80, 'Full name must not exceed 80 characters'],
    },

    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select:    false, // Never returned in queries by default
    },

    avatar: {
      type:    String,
      default: null,
    },

    role: {
      type:    String,
      enum:    ['student', 'admin'],
      default: 'student',
    },

    isVerified: {
      type:    Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt + updatedAt automatically
  }
);

// ─── Pre-save hook: hash password ─────────────────────────────────────────────

/**
 * Hash the password only when it has been modified (create or update).
 * Uses bcrypt with a salt factor of 12 (strong enough for production).
 */
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance methods ─────────────────────────────────────────────────────────

/**
 * Compares a plain-text candidate password against the stored hash.
 * Must be called on a document fetched with `.select('+password')`.
 *
 * @param {string} candidatePassword
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── toJSON transform: strip sensitive fields ─────────────────────────────────

/**
 * Remove password and __v from every JSON serialisation automatically.
 * Controllers never need to manually delete these fields.
 */
userSchema.set('toJSON', {
  virtuals: true,
  transform(_, obj) {
    delete obj.password;
    delete obj.__v;
    return obj;
  },
});

// ─── Model ────────────────────────────────────────────────────────────────────

const User = mongoose.model('User', userSchema);

module.exports = User;
