'use strict';

/**
 * services.js  (AI layer)
 * ─────────────────────────────────────────────────────────────────────────────
 * Gemini API integration for resume analysis.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildResumeAnalysisPrompt } = require('./prompts');
const logger = require('../utils/logger');

// Lazily initialise — allows server to start even without the key (will throw on use)
let genAI = null;

const getClient = () => {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
};

/**
 * Analyse a resume using Gemini 1.5 Flash.
 *
 * @param {string} resumeText  Plain text extracted from the PDF
 * @returns {Promise<Object>}  Structured analysis result
 */
const analyzeResumeWithGemini = async (resumeText) => {
  const client = getClient();
  const model  = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = buildResumeAnalysisPrompt(resumeText);

  logger.info('Sending resume to Gemini for analysis…');
  const result   = await model.generateContent(prompt);
  const response = await result.response;
  const text     = response.text();

  // Strip any accidental markdown code fences Gemini may add
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    logger.error('Gemini returned non-JSON response:', text);
    throw new Error('AI returned an unexpected response format');
  }
};

module.exports = { analyzeResumeWithGemini };
