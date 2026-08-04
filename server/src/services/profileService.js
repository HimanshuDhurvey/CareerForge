'use strict';

/**
 * profileService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Service layer for Profile business logic.
 * Manages fetching, auto-creation, and updating of profile details.
 */

const Profile  = require('../models/profileModel');
const User     = require('../models/userModel');
const ApiError = require('../utils/ApiError');

/**
 * Retrieve a user's profile.
 * If it does not exist, initialize a default profile document immediately
 * and return it (graceful missing profile handling).
 *
 * @param {string} userId
 * @returns {Promise<Object>} The populated profile document
 */
const getProfileByUserId = async (userId) => {
  let profile = await Profile.findOne({ user: userId }).populate('user');

  if (!profile) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User account not found');
    }

    profile = await Profile.create({
      user: userId,
      avatarUrl: user.avatar || '',
    });

    profile = await profile.populate('user');
  }

  return profile;
};

/**
 * Update editable profile fields and sync relevant changes to User model.
 * Does NOT allow modifying the email field.
 *
 * @param {string} userId
 * @param {Object} updateData
 * @returns {Promise<Object>} The updated and populated profile document
 */
const updateProfile = async (userId, updateData) => {
  // 1. Fetch current profile (and create it if it didn't exist)
  let profile = await Profile.findOne({ user: userId });
  if (!profile) {
    profile = await Profile.create({ user: userId });
  }

  // 2. Separate User and Profile updates
  const profileFields = [
    'phoneNumber', 'dateOfBirth', 'college', 'degree', 'branch',
    'graduationYear', 'targetRole', 'targetCompany',
    'skills', 'bio', 'githubUrl', 'linkedinUrl',
    'portfolioUrl', 'location', 'avatarUrl'
  ];

  // Map incoming skills into a clean array if it is not already
  if (updateData.skills) {
    if (typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);
    } else if (!Array.isArray(updateData.skills)) {
      updateData.skills = [];
    }
  }

  // Update profile fields in database
  profileFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      profile[field] = updateData[field];
    }
  });

  await profile.save();

  // 3. Sync User fullName and avatar if they are modified
  const userUpdates = {};
  if (updateData.fullName !== undefined) {
    userUpdates.fullName = updateData.fullName;
  }
  if (updateData.avatarUrl !== undefined) {
    userUpdates.avatar = updateData.avatarUrl;
  }

  if (Object.keys(userUpdates).length > 0) {
    await User.findByIdAndUpdate(userId, userUpdates, { new: true });
  }

  // 4. Return fully updated profile populated with User fields
  return Profile.findOne({ user: userId }).populate('user');
};

module.exports = {
  getProfileByUserId,
  updateProfile,
};
