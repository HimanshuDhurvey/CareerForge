'use strict';

/**
 * analysisService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates PDF text extraction → Gemini AI resume analysis → ResumeAnalysis DB storage.
 */

const fs             = require('fs');
const pdfParse       = require('pdf-parse');
const Resume         = require('../models/resumeModel');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { analyzeResumeWithGemini } = require('../ai/services');
const ApiError       = require('../utils/ApiError');
const logger         = require('../utils/logger');

/**
 * Extract plain text from PDF buffer supporting pdf-parse v1 & v2 APIs.
 *
 * @param {string} filePath Absolute path to PDF file
 * @returns {Promise<string>} Extracted plain text
 */
async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);

  // 1. Support pdf-parse v2 API (PDFParse class)
  if (pdfParse.PDFParse && typeof pdfParse.PDFParse === 'function') {
    const parser = new pdfParse.PDFParse({ data: buffer });
    const textData = await parser.getText();
    if (textData && typeof textData.text === 'string') {
      return textData.text.trim();
    }
  }

  // 2. Support pdf-parse v1 API (function call)
  if (typeof pdfParse === 'function') {
    const pdfData = await pdfParse(buffer);
    if (pdfData && typeof pdfData.text === 'string') {
      return pdfData.text.trim();
    }
  }

  return '';
}

/**
 * Run full AI resume analysis pipeline for a user's uploaded resume.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Created ResumeAnalysis document
 */
const runResumeAnalysis = async (userId) => {
  // 1. Load active resume record
  const resume = await Resume.findOne({ user: userId });
  if (!resume) {
    throw new ApiError(404, 'No resume found. Please upload a resume first.');
  }

  if (!fs.existsSync(resume.path)) {
    throw new ApiError(404, 'Resume file not found on server. Please re-upload your resume.');
  }

  // 2. Mark resume status as analysing
  resume.analysisStatus = 'analysing';
  await resume.save();

  try {
    // 3. Extract text from PDF buffer
    const resumeText = await extractTextFromPdf(resume.path);

    if (!resumeText || resumeText.length < 50) {
      throw new ApiError(
        422,
        'Could not extract enough text from the PDF. Please ensure it is not an image-only scanned document.'
      );
    }

    logger.info(`Extracted ${resumeText.length} characters from PDF resume for user ${userId}`);

    // 4. Call Gemini AI service
    const analysis = await analyzeResumeWithGemini(resumeText);

    // 5. Store analysis record in ResumeAnalysis collection separately (persisting history)
    const newAnalysis = await ResumeAnalysis.create({
      user: userId,
      resume: resume._id,
      originalName: resume.originalName,
      overallScore: analysis.overallScore,
      atsScore: analysis.atsScore,
      formattingScore: analysis.formattingScore,
      contentScore: analysis.contentScore,
      skillsScore: analysis.skillsScore,
      projectsScore: analysis.projectsScore,
      experienceScore: analysis.experienceScore,
      educationScore: analysis.educationScore,
      grammarScore: analysis.grammarScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingKeywords: analysis.missingKeywords,
      recommendedSkills: analysis.recommendedSkills,
      recommendedProjects: analysis.recommendedProjects,
      atsIssues: analysis.atsIssues,
      improvementSuggestions: analysis.improvementSuggestions,
      summary: analysis.summary,
      status: 'completed',
    });

    // 6. Update summary status on active Resume document
    resume.analysisResult = analysis;
    resume.analysisStatus = 'done';
    await resume.save();

    logger.info(`Resume analysis complete for user ${userId} — overall score: ${analysis.overallScore}`);
    return newAnalysis;
  } catch (err) {
    resume.analysisStatus = 'failed';
    await resume.save();
    throw err;
  }
};

/**
 * Get latest ResumeAnalysis document for a user.
 *
 * @param {string} userId
 * @returns {Promise<Object|null>} Latest analysis object
 */
const getLatestAnalysis = async (userId) => {
  const analysis = await ResumeAnalysis.findOne({ user: userId })
    .populate('resume', 'originalName filename')
    .sort({ createdAt: -1 })
    .lean();

  return analysis;
};

/**
 * Get history of all previous ResumeAnalysis records for a user (newest first).
 *
 * @param {string} userId
 * @returns {Promise<Array>} List of analysis objects
 */
const getAnalysisHistory = async (userId) => {
  // Ensure Resume schema model is registered for populate
  require('../models/resumeModel');
  const history = await ResumeAnalysis.find({ user: userId })
    .populate('resume', 'originalName filename')
    .sort({ createdAt: -1 })
    .lean();

  const total = history.length;
  return history.map((item, idx) => {
    const versionNum = total - idx;
    return {
      ...item,
      originalName: item.originalName || item.resume?.originalName || `Resume_v${versionNum}.pdf`,
    };
  });
};

/**
 * Delete a specific ResumeAnalysis document by ID for a user.
 *
 * @param {string} userId
 * @param {string} analysisId
 * @returns {Promise<Object>} Deleted analysis document
 */
const deleteAnalysisById = async (userId, analysisId) => {
  const deleted = await ResumeAnalysis.findOneAndDelete({ _id: analysisId, user: userId });
  if (!deleted) {
    throw new ApiError(404, 'Analysis record not found');
  }
  return deleted;
};

/**
 * Delete all historical ResumeAnalysis documents for a user.
 *
 * @param {string} userId
 * @returns {Promise<Object>} Delete result
 */
const deleteAllAnalyses = async (userId) => {
  const result = await ResumeAnalysis.deleteMany({ user: userId });
  return result;
};

module.exports = {
  runResumeAnalysis,
  getLatestAnalysis,
  getAnalysisHistory,
  deleteAnalysisById,
  deleteAllAnalyses,
};
