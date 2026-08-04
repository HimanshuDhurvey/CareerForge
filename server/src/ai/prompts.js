'use strict';

/**
 * prompts.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized AI prompt templates for CareerForge features.
 */

/**
 * Resume analysis prompt.
 * Instructs Gemini to return a strict JSON object — no markdown, no prose.
 *
 * @param {string} resumeText  Extracted plain text from the resume PDF
 * @returns {string}           The complete prompt string
 */
const buildResumeAnalysisPrompt = (resumeText) => `
You are an expert technical resume reviewer and ATS (Applicant Tracking System) specialist.
Analyze the following resume text and return a JSON response only — no markdown, no explanation outside the JSON.

Resume Text:
"""
${resumeText}
"""

Return ONLY this exact JSON structure (no trailing comma, valid JSON):
{
  "overallScore": <number 0-100, holistic quality score>,
  "atsScore": <number 0-100, how well it will pass ATS systems>,
  "summary": "<2-3 sentence executive summary of the candidate's profile>",
  "strengths": [
    "<strength 1>",
    "<strength 2>",
    "<strength 3>"
  ],
  "weaknesses": [
    "<weakness 1>",
    "<weakness 2>"
  ],
  "suggestions": [
    "<actionable improvement suggestion 1>",
    "<actionable improvement suggestion 2>",
    "<actionable improvement suggestion 3>",
    "<actionable improvement suggestion 4>",
    "<actionable improvement suggestion 5>"
  ],
  "keywords": {
    "matched": ["<keyword found in resume>", "..."],
    "missing": ["<important tech keyword not in resume>", "..."]
  }
}
`.trim();

module.exports = {
  buildResumeAnalysisPrompt,
};
