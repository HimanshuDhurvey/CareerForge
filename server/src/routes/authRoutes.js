'use strict';

/**
 * authRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for all authentication endpoints.
 *
 * Mounted at /api/auth in app.js.
 *
 * Routes:
 *   POST   /api/auth/register   — Create a new account
 *   POST   /api/auth/login      — Authenticate and receive a JWT
 *   POST   /api/auth/logout     — Clear the session cookie
 *   GET    /api/auth/me         — Return the current user (protected)
 */

const express        = require('express');
const authController = require('../controllers/authController');
const { protect }    = require('../middlewares/authMiddleware');
const { registerRules, loginRules } = require('../validators/authValidator');

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerRules, authController.register);

// POST /api/auth/login
router.post('/login', loginRules, authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET  /api/auth/me  — protected
router.get('/me', protect, authController.getMe);

module.exports = router;
