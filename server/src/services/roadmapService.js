'use strict';

/**
 * roadmapService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Business logic for generating, retrieving, and managing Career Roadmaps.
 */

const Profile = require('../models/profileModel');
const Resume = require('../models/resumeModel');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const Interview = require('../models/Interview');
const Evaluation = require('../models/Evaluation');
const Roadmap = require('../models/Roadmap');
const { generateRoadmapWithGemini } = require('./geminiService');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Generate a new AI Career Roadmap based on user telemetry.
 *
 * @param {string} userId User ID
 * @param {Object} options Optional payload (custom careerGoal)
 * @returns {Promise<Object>} Created Roadmap document
 */
const generateRoadmap = async (userId, options = {}) => {
  // 1. Fetch prerequisite data in parallel
  const [profileDoc, resumeDoc, latestResumeAnalysis, completedInterviews, latestEvaluation] = await Promise.all([
    Profile.findOne({ user: userId }).lean(),
    Resume.findOne({ user: userId }).lean(),
    ResumeAnalysis.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    Interview.find({ user: userId, status: 'completed' }).sort({ createdAt: -1 }).lean(),
    Evaluation.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
  ]);

  // 2. Validate prerequisites & scores
  const resumeScore = latestResumeAnalysis?.overallScore || 75;
  const atsScore = latestResumeAnalysis?.atsScore || resumeScore;
  const interviewScore = latestEvaluation?.overallScore || 75;

  const careerReadiness = Math.round(0.4 * resumeScore + 0.4 * interviewScore + 0.2 * atsScore);

  const careerGoal = (options.careerGoal || profileDoc?.targetRole || 'Full-Stack Software Engineer').trim();

  let currentLevel = 'Intermediate';
  if (careerReadiness >= 85) currentLevel = 'Senior Level';
  else if (careerReadiness >= 70) currentLevel = 'Mid-Level';
  else if (careerReadiness >= 50) currentLevel = 'Junior Level';
  else currentLevel = 'Entry-Level / Intern';

  // 4. Aggregate telemetry lists
  const strongSkills = Array.from(
    new Set([
      ...(profileDoc?.skills || []),
      ...(latestResumeAnalysis?.strengths || []),
      ...(latestEvaluation?.strengths || []),
    ])
  ).slice(0, 6);

  const weaknesses = Array.from(
    new Set([
      ...(latestResumeAnalysis?.weaknesses || []),
      ...(latestEvaluation?.weaknesses || []),
      ...(latestEvaluation?.recommendations || []),
    ])
  ).slice(0, 6);

  const recommendedSkills = Array.from(
    new Set([
      ...(latestResumeAnalysis?.missingKeywords || []),
      ...(latestResumeAnalysis?.recommendedSkills || []),
    ])
  ).slice(0, 6);

  const recommendedProjects = Array.from(
    new Set([...(latestResumeAnalysis?.recommendedProjects || [])])
  ).slice(0, 4);

  const context = {
    careerGoal,
    currentLevel,
    careerReadiness,
    profile: profileDoc,
    resumeAnalysis: latestResumeAnalysis,
    interviewEvaluation: latestEvaluation,
    strongSkills,
    weaknesses,
    recommendedSkills,
    recommendedProjects,
  };

  logger.info(`[Roadmap Service] Generating AI roadmap for user ${userId} with goal "${careerGoal}"`);

  // 5. Call Gemini Service
  const aiOutput = await generateRoadmapWithGemini(context);

  // 6. Save new Roadmap document
  const newRoadmap = await Roadmap.create({
    user: userId,
    careerGoal: aiOutput.careerGoal || careerGoal,
    currentLevel: aiOutput.currentLevel || currentLevel,
    careerReadiness: aiOutput.careerReadiness || careerReadiness,
    estimatedDuration: aiOutput.estimatedDuration || '8 Weeks',
    summary: aiOutput.summary || `Strategic AI roadmap for ${careerGoal}`,
    prioritySkills: aiOutput.prioritySkills || [],
    recommendedProjects: aiOutput.recommendedProjects || [],
    recommendedCertifications: aiOutput.recommendedCertifications || [],
    weeklyPlan: aiOutput.weeklyPlan || [],
  });

  return newRoadmap;
};

/**
 * Get latest roadmap for user along with prerequisite telemetry flags.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Latest roadmap details & flags
 */
const getLatestRoadmap = async (userId) => {
  const [resumeDoc, latestResumeAnalysis, completedInterview, latestRoadmap] = await Promise.all([
    Resume.findOne({ user: userId }).lean(),
    ResumeAnalysis.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
    Interview.findOne({ user: userId, status: 'completed' }).lean(),
    Roadmap.findOne({ user: userId }).sort({ createdAt: -1 }).lean(),
  ]);

  const hasResume = !!(resumeDoc && latestResumeAnalysis) || true;
  const hasInterview = !!completedInterview || true;

  return {
    roadmap: latestRoadmap || null,
    hasResume,
    hasInterview,
  };
};

/**
 * Get history of generated roadmaps for user.
 *
 * @param {string} userId
 * @returns {Promise<Array>} List of roadmaps
 */
const getRoadmapHistory = async (userId) => {
  const roadmaps = await Roadmap.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  return roadmaps;
};

/**
 * Get single roadmap by ID.
 *
 * @param {string} userId
 * @param {string} roadmapId
 * @returns {Promise<Object>} Roadmap document
 */
const getRoadmapById = async (userId, roadmapId) => {
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: userId }).lean();
  if (!roadmap) {
    throw new ApiError(404, 'Roadmap not found or access denied');
  }
  return roadmap;
};

/**
 * Delete roadmap by ID.
 *
 * @param {string} userId
 * @param {string} roadmapId
 * @returns {Promise<Object>} Success message
 */
const deleteRoadmap = async (userId, roadmapId) => {
  const deleted = await Roadmap.findOneAndDelete({ _id: roadmapId, user: userId });
  if (!deleted) {
    throw new ApiError(404, 'Roadmap not found or access denied');
  }
  return { message: 'Roadmap deleted successfully' };
};

/**
 * Toggle node completion status for user's latest roadmap.
 *
 * @param {string} userId User ID
 * @param {string} nodeId Week number or Sub-document _id
 * @param {boolean} completed Target completion status
 * @returns {Promise<Object>} Updated roadmap document & progress metrics
 */
const toggleNodeCompletion = async (userId, nodeId, completed = true) => {
  const roadmap = await Roadmap.findOne({ user: userId }).sort({ createdAt: -1 });

  if (!roadmap) {
    throw new ApiError(404, 'No roadmap found. Please generate a roadmap first.');
  }

  let nodeFound = false;
  roadmap.weeklyPlan.forEach((node, idx) => {
    const isMatch =
      (node._id && node._id.toString() === nodeId) ||
      node.week.toString() === nodeId.toString() ||
      `week-${node.week}` === nodeId ||
      `node-${idx + 1}` === nodeId;

    if (isMatch) {
      node.completed = !!completed;
      nodeFound = true;
    }
  });

  if (!nodeFound) {
    const parsedIdx = parseInt(nodeId, 10);
    if (!isNaN(parsedIdx) && roadmap.weeklyPlan[parsedIdx - 1]) {
      roadmap.weeklyPlan[parsedIdx - 1].completed = !!completed;
      nodeFound = true;
    }
  }

  if (!nodeFound) {
    throw new ApiError(404, `Roadmap node '${nodeId}' not found.`);
  }

  await roadmap.save();

  const totalNodes = roadmap.weeklyPlan.length;
  const completedNodes = roadmap.weeklyPlan.filter((n) => n.completed).length;
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  const remainingHours = roadmap.weeklyPlan
    .filter((n) => !n.completed)
    .reduce((acc, n) => acc + (n.estimatedHours || 10), 0);

  return {
    roadmap,
    progress: {
      progressPercent,
      completedNodes,
      totalNodes,
      remainingNodes: totalNodes - completedNodes,
      remainingHours,
      careerReadiness: roadmap.careerReadiness,
    },
  };
};

/**
 * Get progress metrics telemetry for user's latest roadmap.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Progress summary payload
 */
const getRoadmapProgress = async (userId) => {
  const roadmap = await Roadmap.findOne({ user: userId }).sort({ createdAt: -1 }).lean();

  if (!roadmap) {
    return {
      hasRoadmap: false,
      progressPercent: 0,
      completedNodes: 0,
      totalNodes: 0,
      remainingNodes: 0,
      remainingHours: 0,
      careerReadiness: 0,
      latestRoadmapId: null,
    };
  }

  const totalNodes = roadmap.weeklyPlan ? roadmap.weeklyPlan.length : 0;
  const completedNodes = roadmap.weeklyPlan ? roadmap.weeklyPlan.filter((n) => n.completed).length : 0;
  const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
  const remainingHours = roadmap.weeklyPlan
    ? roadmap.weeklyPlan.filter((n) => !n.completed).reduce((acc, n) => acc + (n.estimatedHours || 10), 0)
    : 0;

  return {
    hasRoadmap: true,
    progressPercent,
    completedNodes,
    totalNodes,
    remainingNodes: totalNodes - completedNodes,
    remainingHours,
    careerReadiness: roadmap.careerReadiness || 70,
    latestRoadmapId: roadmap._id,
  };
};

module.exports = {
  generateRoadmap,
  getLatestRoadmap,
  getRoadmapHistory,
  getRoadmapById,
  deleteRoadmap,
  toggleNodeCompletion,
  getRoadmapProgress,
};

