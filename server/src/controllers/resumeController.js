'use strict';

/**
 * resumeController.js
 * ─────────────────────────────────────────────────────────────────────────────
 * HTTP handlers for the resume endpoints.
 */

const path            = require('path');
const fs              = require('fs');
const resumeService   = require('../services/resumeService');
const analysisService = require('../services/analysisService');
const ApiResponse     = require('../utils/ApiResponse');
const ApiError        = require('../utils/ApiError');

/**
 * Formats a resume document into a clean API response shape.
 */
const formatResume = (resume) => ({
  id:             resume._id,
  originalName:   resume.originalName,
  filename:       resume.filename,
  fileSize:       resume.fileSize,
  mimeType:       resume.mimeType,
  uploadedAt:     resume.uploadedAt,
  analysisStatus: resume.analysisStatus,
  analysisResult: resume.analysisResult || null,
  createdAt:      resume.createdAt,
  updatedAt:      resume.updatedAt,
});

/**
 * POST /api/resume/upload
 * Upload a PDF resume (multipart/form-data field: "resume")
 */
const uploadResume = async (req, res, next) => {
  try {
    const resume = await resumeService.uploadResume(req.user._id, req.file);
    res.status(201).json(
      new ApiResponse(201, formatResume(resume), 'Resume uploaded successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resume
 * Get the current user's resume metadata.
 */
const getResume = async (req, res, next) => {
  try {
    const resume = await resumeService.getResume(req.user._id);
    if (!resume) {
      return res.status(200).json(
        new ApiResponse(200, null, 'No resume found')
      );
    }
    res.status(200).json(
      new ApiResponse(200, formatResume(resume), 'Resume retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resume
 * Delete the current user's resume.
 */
const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.user._id);
    res.status(200).json(
      new ApiResponse(200, null, 'Resume deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resume/file/:filename
 * Serve the PDF file for preview.
 */
const serveResumeFile = (req, res, next) => {
  try {
    const { filename } = req.params;

    const safeName = path.basename(filename);
    const filePath = path.join(__dirname, '../../uploads/resumes', safeName);

    if (!fs.existsSync(filePath)) {
      return next(new ApiError(404, 'Resume file not found'));
    }

    res.removeHeader('X-Frame-Options');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeName}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resume/analyze
 * Trigger AI analysis on the current user's resume.
 */
const analyzeResume = async (req, res, next) => {
  try {
    const analysis = await analysisService.runResumeAnalysis(req.user._id);
    res.status(200).json(
      new ApiResponse(200, analysis, 'Resume analysis completed successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resume/analysis
 * Get current user's latest resume analysis.
 */
const getLatestAnalysis = async (req, res, next) => {
  try {
    const analysis = await analysisService.getLatestAnalysis(req.user._id);
    res.status(200).json(
      new ApiResponse(200, analysis, 'Latest resume analysis retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resume/analysis/history
 * Get history of all previous resume analyses.
 */
const getAnalysisHistory = async (req, res, next) => {
  try {
    const history = await analysisService.getAnalysisHistory(req.user._id);
    res.status(200).json(
      new ApiResponse(200, history, 'Resume analysis history retrieved successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resume/analysis/:id
 * Delete a specific historical resume analysis record.
 */
const deleteAnalysisRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    await analysisService.deleteAnalysisById(req.user._id, id);
    res.status(200).json(
      new ApiResponse(200, null, 'Analysis record deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resume/analysis/all
 * Delete all historical resume analysis records for the user.
 */
const deleteAllAnalysisRecords = async (req, res, next) => {
  try {
    await analysisService.deleteAllAnalyses(req.user._id);
    res.status(200).json(
      new ApiResponse(200, null, 'All historical resume analysis records deleted successfully')
    );
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadResume,
  getResume,
  deleteResume,
  serveResumeFile,
  analyzeResume,
  getLatestAnalysis,
  getAnalysisHistory,
  deleteAnalysisRecord,
  deleteAllAnalysisRecords,
};
