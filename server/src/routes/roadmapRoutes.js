'use strict';

/**
 * roadmapRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for Career Roadmap endpoints.
 * Secured by JWT protection middleware.
 */

const express = require('express');
const roadmapController = require('../controllers/roadmapController');
const { protect } = require('../middlewares/authMiddleware');
const { generateRoadmapRules, roadmapIdRules } = require('../validators/roadmapValidator');

const router = express.Router();

// Apply JWT auth protection to all roadmap routes
router.use(protect);

// POST /api/roadmap/generate - Generate a new AI career roadmap
router.post('/generate', generateRoadmapRules, roadmapController.generateRoadmap);

// GET /api/roadmap - Return latest roadmap and telemetry flags
router.get('/', roadmapController.getLatestRoadmap);

// GET /api/roadmap/history - Return history of generated roadmaps
router.get('/history', roadmapController.getRoadmapHistory);

// GET /api/roadmap/progress - Get progress summary telemetry
router.get('/progress', roadmapController.getRoadmapProgress);

// PATCH /api/roadmap/node/:id/complete - Mark roadmap node completed
router.patch('/node/:id/complete', roadmapController.completeNode);

// PATCH /api/roadmap/node/:id/reset - Mark roadmap node incomplete
router.patch('/node/:id/reset', roadmapController.resetNode);

// GET /api/roadmap/:id - Return details for a specific roadmap
router.get('/:id', roadmapIdRules, roadmapController.getRoadmapById);

// DELETE /api/roadmap/:id - Delete a specific roadmap
router.delete('/:id', roadmapIdRules, roadmapController.deleteRoadmap);

module.exports = router;
