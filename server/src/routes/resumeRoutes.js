'use strict';

/**
 * resumeRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Express router for resume management & AI Resume Analyzer endpoints.
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

// GET  /api/resume/file/:filename — serve the PDF
router.get('/file/:filename', resumeController.serveResumeFile);

// POST /api/resume/analyze     — generate Gemini AI resume analysis
router.post('/analyze', protect, resumeController.analyzeResume);

// GET  /api/resume/analysis     — fetch latest resume analysis report
router.get('/analysis', protect, resumeController.getLatestAnalysis);

// GET  /api/resume/analysis/history — fetch resume analysis history list
router.get('/analysis/history', protect, resumeController.getAnalysisHistory);

module.exports = router;
