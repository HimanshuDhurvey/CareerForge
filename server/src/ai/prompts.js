'use strict';

/**
 * prompts.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized AI prompt templates for CareerForge features.
 */

/**
 * Resume analysis prompt.
 * Instructs Gemini to act as a Senior Technical Recruiter, ATS Expert, and Hiring Manager.
 *
 * @param {string} resumeText Extracted plain text from the resume PDF
 * @returns {string} The complete prompt string
 */
const buildResumeAnalysisPrompt = (resumeText) => `
You are an elite Senior Technical Recruiter, Senior ATS Expert, and Senior Software Engineering Hiring Manager evaluating a candidate's resume.

Analyze the provided resume text thoroughly across the following dimensions:
1. Overall Resume Quality & Impact
2. ATS (Applicant Tracking System) Compatibility
3. Technical Skills Depth & Breadth
4. Technical Projects & Portfolio Quality
5. Work Experience & Achievements
6. Education & Credentials
7. Formatting, Layout & Readability
8. Keyword Optimization & Industry Readiness
9. Grammar, Syntax & Professional Tone

Resume Text:
"""
${resumeText}
"""

Output Requirements:
You MUST respond with raw valid JSON ONLY — no markdown code fences (do not use \`\`\`json), no preamble, no prose outside JSON.

Strict JSON Object Structure:
{
  "overallScore": number (integer 0-100),
  "atsScore": number (integer 0-100),
  "formattingScore": number (integer 0-100),
  "contentScore": number (integer 0-100),
  "skillsScore": number (integer 0-100),
  "projectsScore": number (integer 0-100),
  "experienceScore": number (integer 0-100),
  "educationScore": number (integer 0-100),
  "grammarScore": number (integer 0-100),
  "strengths": ["string", "string", ...],
  "weaknesses": ["string", "string", ...],
  "missingKeywords": ["string", "string", ...],
  "recommendedSkills": ["string", "string", ...],
  "recommendedProjects": ["string", "string", ...],
  "atsIssues": ["string", "string", ...],
  "improvementSuggestions": ["string", "string", ...],
  "summary": "3-4 sentence executive summary of candidate profile, strengths, and target alignment"
}
`.trim();

module.exports = {
  buildResumeAnalysisPrompt,
};
