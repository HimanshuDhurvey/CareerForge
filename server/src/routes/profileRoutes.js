'use strict';

/**
 * profileRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for profile endpoints.
 * Secured by JWT protection.
 */

const express           = require('express');
const profileController = require('../controllers/profileController');
const { protect }       = require('../middlewares/authMiddleware');
const { updateProfileRules } = require('../validators/profileValidator');

const router = express.Router();

// GET /api/profile
router.get('/', protect, profileController.getProfile);

// PUT /api/profile
router.put('/', protect, updateProfileRules, profileController.updateProfile);

module.exports = router;
