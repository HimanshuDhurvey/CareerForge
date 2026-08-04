'use strict';

/**
 * profileController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Controller layer for profile endpoints.
 */

const profileService = require('../services/profileService');
const ApiResponse    = require('../utils/ApiResponse');

/**
 * Helper to format profile database object into a clean flat response.
 *
 * @param {Object} profile - Populated profile document
 * @returns {Object} Cleaned, flattened profile response
 */
const formatProfile = (profile) => {
  const user = profile.user || {};
  return {
    id:             profile._id,
    userId:         user._id || null,
    fullName:       user.fullName || '',
    email:          user.email || '',
    phoneNumber:    profile.phoneNumber || '',
    college:        profile.college || '',
    degree:         profile.degree || '',
    branch:         profile.branch || '',
    graduationYear: profile.graduationYear,
    targetRole:     profile.targetRole || '',
    targetCompany:  profile.targetCompany || '',
    skills:         profile.skills || [],
    bio:            profile.bio || '',
    githubUrl:      profile.githubUrl || '',
    linkedinUrl:    profile.linkedinUrl || '',
    portfolioUrl:   profile.portfolioUrl || '',
    location:       profile.location || '',
    avatarUrl:      profile.avatarUrl || user.avatar || '',
    createdAt:      profile.createdAt,
    updatedAt:      profile.updatedAt,
  };
};

/**
 * GET /api/profile
 * Retrieves the authenticated user's profile.
 */
const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user._id);
    
    res.status(200).json(
      new ApiResponse(200, formatProfile(profile), 'Profile retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/profile
 * Updates the authenticated user's profile.
 */
const updateProfile = async (req, res, next) => {
  try {
    const profile = await profileService.updateProfile(req.user._id, req.body);

    res.status(200).json(
      new ApiResponse(200, formatProfile(profile), 'Profile updated successfully')
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
