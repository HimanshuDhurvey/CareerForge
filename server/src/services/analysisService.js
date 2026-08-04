'use strict';

/**
 * analysisService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates resume text extraction → Gemini AI analysis → DB persistence.
 */

const fs       = require('fs');
const pdfParse = require('pdf-parse');
const Resume   = require('../models/resumeModel');
const { analyzeResumeWithGemini } = require('../ai/services');
const ApiError = require('../utils/ApiError');
const logger   = require('../utils/logger');

/**
 * Run the full analysis pipeline for a user's resume.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Updated Resume document
 */
const runResumeAnalysis = async (userId) => {
  // 1. Load the current resume document
  const resume = await Resume.findOne({ user: userId });
  if (!resume) {
    throw new ApiError(404, 'No resume found. Please upload a resume first.');
  }

  if (!fs.existsSync(resume.path)) {
    throw new ApiError(404, 'Resume file not found on server. Please re-upload.');
  }

  // 2. Mark as analysing immediately so the client can show a spinner
  resume.analysisStatus = 'analysing';
  await resume.save();

  try {
    // 3. Extract text from PDF
    const buffer     = fs.readFileSync(resume.path);
    const pdfData    = await pdfParse(buffer);
    const resumeText = pdfData.text?.trim();

    if (!resumeText || resumeText.length < 50) {
      throw new ApiError(422, 'Could not extract enough text from the PDF. Please ensure it is not scanned/image-only.');
    }

    logger.info(`Extracted ${resumeText.length} characters from resume for user ${userId}`);

    // 4. Call Gemini
    const analysis = await analyzeResumeWithGemini(resumeText);

    // 5. Persist result
    resume.analysisResult  = analysis;
    resume.analysisStatus  = 'done';
    await resume.save();

    logger.info(`Resume analysis complete for user ${userId} — score: ${analysis.overallScore}`);
    return resume;

  } catch (err) {
    // Mark as failed so UI can display an error state
    resume.analysisStatus = 'failed';
    await resume.save();
    throw err;
  }
};

module.exports = { runResumeAnalysis };
