'use strict';

/**
 * resumeRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for resume management endpoints.
 */

const express           = require('express');
const resumeController  = require('../controllers/resumeController');
const { protect }       = require('../middlewares/authMiddleware');
const upload            = require('../middlewares/uploadMiddleware');

const router = express.Router();

// GET  /api/resume             — fetch resume metadata
router.get('/', protect, resumeController.getResume);

// POST /api/resume/upload      — upload PDF (multer handles multipart)
router.post('/upload', protect, upload.single('resume'), resumeController.uploadResume);

// DELETE /api/resume           — delete resume
router.delete('/', protect, resumeController.deleteResume);

// GET  /api/resume/file/:filename — serve the PDF (no auth — filename is the access token)
router.get('/file/:filename', resumeController.serveResumeFile);

// POST /api/resume/analyze     — trigger Gemini AI analysis
router.post('/analyze', protect, resumeController.analyzeResume);

module.exports = router;
