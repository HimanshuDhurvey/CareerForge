'use strict';

/**
 * roadmapController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express controllers handling HTTP requests for the Career Roadmap module.
 */

const roadmapService = require('../services/roadmapService');
const ApiResponse = require('../utils/ApiResponse');

/**
 * POST /api/roadmap/generate
 * Generate a new AI career roadmap for the authenticated user.
 */
const generateRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { careerGoal } = req.body;
    const roadmap = await roadmapService.generateRoadmap(userId, { careerGoal });

    res.status(201).json(
      new ApiResponse(201, roadmap, 'AI Career Roadmap generated successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/roadmap
 * Return latest roadmap for the authenticated user along with prerequisite flags.
 */
const getLatestRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const data = await roadmapService.getLatestRoadmap(userId);

    res.status(200).json(
      new ApiResponse(200, data, 'Latest career roadmap fetched successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/roadmap/history
 * Return history of generated roadmaps for the authenticated user.
 */
const getRoadmapHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const history = await roadmapService.getRoadmapHistory(userId);

    res.status(200).json(
      new ApiResponse(200, history, 'Roadmap history retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/roadmap/:id
 * Return details for a specific roadmap by ID.
 */
const getRoadmapById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const roadmapId = req.params.id;
    const roadmap = await roadmapService.getRoadmapById(userId, roadmapId);

    res.status(200).json(
      new ApiResponse(200, roadmap, 'Roadmap details retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/roadmap/:id
 * Delete a specific roadmap by ID.
 */
const deleteRoadmap = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const roadmapId = req.params.id;
    const result = await roadmapService.deleteRoadmap(userId, roadmapId);

    res.status(200).json(
      new ApiResponse(200, result, 'Roadmap deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  generateRoadmap,
  getLatestRoadmap,
  getRoadmapHistory,
  getRoadmapById,
  deleteRoadmap,
};
