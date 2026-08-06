'use strict';

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { buildResumeAnalysisPrompt } = require('./prompts');
const logger = require('../utils/logger');

/**
 * Supported Gemini models for Google AI JS SDK (@google/generative-ai)
 */
const SUPPORTED_GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-1.5-pro'];

/**
 * Heuristic Evaluation Engine implementing FAANG Recruiter & ATS Scoring Standards.
 * Evaluates text strictly without score inflation across 3 clear candidate tiers.
 *
 * @param {string} resumeText Extracted plain text from the resume PDF
 * @returns {Object} Structured analysis matching schema
 */
function generateSmartFallbackResumeAnalysis(resumeText) {
  const text = (resumeText || '').trim();
  const lowerText = text.toLowerCase();
  const wordCount = text ? text.split(/\s+/).length : 0;

  // 1. Structural & Key Presence Checks
  const hasGitHub = lowerText.includes('github.com') || lowerText.includes('github');
  const hasLinkedIn = lowerText.includes('linkedin.com') || lowerText.includes('linkedin');
  const hasSummary = lowerText.includes('summary') || lowerText.includes('profile') || lowerText.includes('about me');
  const hasExperience = lowerText.includes('experience') || lowerText.includes('senior software engineer') || lowerText.includes('intern') || lowerText.includes('internship') || lowerText.includes('developer at');
  const hasEducation = lowerText.includes('education') || lowerText.includes('b.tech') || lowerText.includes('b.s.') || lowerText.includes('bachelor') || lowerText.includes('master') || lowerText.includes('university') || lowerText.includes('college');

  // Quantified metrics check (numbers followed by %, ms, s, k, m, x, $)
  const metricsMatches = text.match(/\b\d+(\.\d+)?(%|k|m|x|ms|s|\$|\s*percent|\s*users|\s*requests)\b/gi) || [];
  const hasMetrics = metricsMatches.length >= 2;

  // Modern tech keyword extraction
  const targetKeywords = [
    'javascript', 'typescript', 'react', 'node', 'express', 'mongodb', 'sql',
    'postgresql', 'python', 'git', 'docker', 'aws', 'kubernetes', 'graphql',
    'rest api', 'redux', 'ci/cd', 'redis', 'system design', 'microservices', 'unit testing'
  ];

  const matchedTech = targetKeywords.filter((kw) => lowerText.includes(kw));
  const missingTech = targetKeywords.filter((kw) => !lowerText.includes(kw)).slice(0, 5);

  // Project Complexity check
  const simpleProjectKeywords = ['todo', 'to-do', 'calculator', 'tic tac toe', 'weather app', 'simple portfolio'];
  const isSimpleProject = simpleProjectKeywords.some((kw) => lowerText.includes(kw));
  const advancedProjectKeywords = ['microservice', 'microservices', 'aws', 'docker', 'kubernetes', 'ci/cd', 'redis', 'graphql', 'system design', 'distributed', 'kafka', 'websocket'];
  const isAdvancedProject = advancedProjectKeywords.some((kw) => lowerText.includes(kw));

  // 2. Strict Scoring Tier Calculation based on candidate tier
  let atsScore = 70;
  let formattingScore = 75;
  let contentScore = 70;
  let skillsScore = 70;
  let projectsScore = 70;
  let experienceScore = 70;
  let educationScore = 80;
  let grammarScore = 85;

  // TIER 1: Very Poor / Incomplete Resume (< 50 words OR missing core sections)
  if (wordCount < 50 || (!hasExperience && !hasProjects && wordCount < 80)) {
    atsScore = 35;
    formattingScore = 40;
    contentScore = 32;
    skillsScore = 40;
    projectsScore = 35;
    experienceScore = 30;
    educationScore = 55;
    grammarScore = 70;
  }
  // TIER 3: Strong Software Engineering Resume (GitHub + LinkedIn + Metrics + Experience + Advanced Stack)
  else if (hasGitHub && hasLinkedIn && hasMetrics && hasExperience && matchedTech.length >= 6) {
    atsScore = 92;
    formattingScore = 90;
    contentScore = 92;
    skillsScore = Math.min(96, 75 + matchedTech.length * 2);
    projectsScore = isAdvancedProject ? 94 : 85;
    experienceScore = 92;
    educationScore = 88;
    grammarScore = 95;
  }
  // TIER 2: Average Student / Early Career Resume (50 - 200 words, basic projects, missing metrics or links)
  else {
    atsScore = (hasGitHub ? 75 : 62) + (hasLinkedIn ? 8 : 0);
    formattingScore = 72;
    contentScore = hasMetrics ? 78 : 65;
    skillsScore = Math.min(80, 55 + matchedTech.length * 3);
    projectsScore = isSimpleProject ? 58 : 72;
    experienceScore = hasExperience ? 75 : 45;
  }

  // 3. Apply Mandatory Deductions
  if (!hasGitHub) {
    atsScore = Math.max(30, atsScore - 12);
    projectsScore = Math.max(30, projectsScore - 12);
  }
  if (!hasLinkedIn) {
    atsScore = Math.max(30, atsScore - 8);
  }
  if (!hasMetrics) {
    contentScore = Math.max(30, contentScore - 12);
    experienceScore = Math.max(30, experienceScore - 10);
  }
  if (!hasSummary) {
    contentScore = Math.max(30, contentScore - 8);
  }
  if (!hasExperience) {
    experienceScore = Math.min(48, experienceScore);
  }
  if (isSimpleProject) {
    projectsScore = Math.min(60, projectsScore);
  }

  // Weighted overall calculation
  const finalOverall = Math.min(98, Math.max(25, Math.round(
    atsScore * 0.25 +
    contentScore * 0.25 +
    skillsScore * 0.20 +
    projectsScore * 0.15 +
    experienceScore * 0.15
  )));

  // 4. Dynamic Strengths Construction
  const strengths = [];
  if (hasGitHub) strengths.push('Included GitHub profile URL for technical code verification');
  if (hasLinkedIn) strengths.push('Included professional LinkedIn profile link');
  if (hasMetrics) strengths.push('Demonstrated measurable impact using quantified performance metrics (% growth, scale)');
  if (matchedTech.length >= 4) strengths.push(`Strong core tech stack featuring: ${matchedTech.slice(0, 4).join(', ')}`);
  if (hasExperience) strengths.push('Listed relevant software development work experience');
  if (hasEducation) strengths.push('Clear academic credentials and degree foundation');
  if (strengths.length === 0) strengths.push('Basic technical resume layout provided');

  // 5. Dynamic Weaknesses Construction
  const weaknesses = [];
  if (!hasGitHub) weaknesses.push('Missing GitHub profile link (Mandatory ATS & recruiter screening requirement)');
  if (!hasLinkedIn) weaknesses.push('Missing LinkedIn professional profile link');
  if (!hasMetrics) weaknesses.push('Lacks quantified impact metrics (e.g., %, $, user scale, latency reduction) in bullet points');
  if (!hasExperience) weaknesses.push('No formal software engineering work experience or internship listed');
  if (!hasSummary) weaknesses.push('Missing professional summary or objective statement');
  if (isSimpleProject) weaknesses.push('Projects feature simple CRUD applications; lacks advanced system architecture or cloud deployment');
  if (matchedTech.length < 5) weaknesses.push(`Limited modern technical keywords detected (Missing: ${missingTech.slice(0, 3).join(', ')})`);

  // 6. Dynamic Improvement Suggestions
  const improvementSuggestions = [];
  if (!hasGitHub) improvementSuggestions.push('Add a prominent GitHub profile link at the top of your resume containing active repositories');
  if (!hasMetrics) improvementSuggestions.push('Rewrite bullet points using Action Verb + Task + Quantified Result format (e.g. "Optimized API latency by 35% using Redis caching")');
  if (!hasLinkedIn) improvementSuggestions.push('Add your custom LinkedIn URL to the header section for recruiter verification');
  if (isSimpleProject) improvementSuggestions.push('Upgrade project section with full-stack microservice applications deployed on AWS/Docker with live demo links');
  if (!hasSummary) improvementSuggestions.push('Include a 2-3 line Professional Summary highlighting core technical domain expertise');

  // 7. Recommended Skills & Projects
  const recommendedSkills = missingTech.length > 0 ? missingTech : ['TypeScript', 'Docker', 'AWS', 'System Design', 'CI/CD'];
  const recommendedProjects = [
    'Full-Stack Microservices Architecture with Redis Caching & Docker Deployment',
    'Real-Time Collaborative Dashboard using WebSockets & Node.js',
    'Cloud-Native REST API Service with Automated CI/CD Pipeline & AWS Hosting'
  ];

  const atsIssues = [];
  if (!hasGitHub) atsIssues.push('Critical Contact Error: Missing GitHub URL');
  if (!hasLinkedIn) atsIssues.push('Missing Contact Link: No LinkedIn handle found');
  if (!hasSummary) atsIssues.push('Missing Header Section: No Executive Summary section header');
  if (!hasMetrics) atsIssues.push('Content Quality Risk: Bullet points lack numerical data metrics');

  // 8. Specific Recruiter Executive Summary
  let gradeLabel = 'Poor';
  if (finalOverall >= 90) gradeLabel = 'Excellent';
  else if (finalOverall >= 80) gradeLabel = 'Good';
  else if (finalOverall >= 70) gradeLabel = 'Above Average';
  else if (finalOverall >= 60) gradeLabel = 'Average';
  else if (finalOverall >= 50) gradeLabel = 'Weak';

  const summary = `Candidate resume evaluated at a ${finalOverall}% (${gradeLabel}) rating based on ${wordCount} words of content. ${
    !hasGitHub || !hasMetrics
      ? `Evaluation deducted points due to missing GitHub links (${!hasGitHub ? 'Absent' : 'Present'}) and lack of quantified bullet point metrics.`
      : 'Resume demonstrates solid technical alignment with clear project context and metrics.'
  } Key focus areas for recruiter screening include adding measurable achievements and expanding modern cloud/system architecture depth.`;

  return {
    overallScore: finalOverall,
    atsScore: Math.min(100, Math.max(25, atsScore)),
    formattingScore: Math.min(100, Math.max(25, formattingScore)),
    contentScore: Math.min(100, Math.max(25, contentScore)),
    skillsScore: Math.min(100, Math.max(25, skillsScore)),
    projectsScore: Math.min(100, Math.max(25, projectsScore)),
    experienceScore: Math.min(100, Math.max(25, experienceScore)),
    educationScore: Math.min(100, Math.max(25, educationScore)),
    grammarScore: Math.min(100, Math.max(25, grammarScore)),
    strengths,
    weaknesses,
    missingKeywords: missingTech,
    recommendedSkills,
    recommendedProjects,
    atsIssues,
    improvementSuggestions,
    summary,
  };
}

/**
 * Analyse a resume using Gemini API.
 * Uses strict FAANG recruiter prompt and logs technical errors strictly on backend.
 *
 * @param {string} resumeText Plain text extracted from the PDF
 * @returns {Promise<Object>} Structured analysis result matching all schema fields
 */
const analyzeResumeWithGemini = async (resumeText) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    logger.warn('[Gemini AI] API key unconfigured in server/.env. Utilizing FAANG Recruiter Heuristic Engine.');
    return generateSmartFallbackResumeAnalysis(resumeText);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildResumeAnalysisPrompt(resumeText);

  let rawText = '';
  let lastError = null;

  for (const modelName of SUPPORTED_GEMINI_MODELS) {
    try {
      logger.info(`[Gemini AI] Requesting strict recruiter analysis from model: ${modelName}`);

      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Low temperature for deterministic scoring consistency
        },
      });

      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API request timed out after 30 seconds')), 30000)
        ),
      ]);

      const response = await result.response;
      rawText = response.text();
      if (rawText && rawText.trim()) {
        logger.info(`[Gemini AI] Successful recruiter analysis received from model ${modelName}`);
        break;
      }
    } catch (err) {
      logger.error(`[Gemini AI Error] Execution failed on model ${modelName}:`, {
        message: err.message,
        stack: err.stack,
      });
      lastError = err;

      if (
        err.message?.includes('API_KEY_INVALID') ||
        err.message?.includes('API key not valid') ||
        err.message?.includes('400')
      ) {
        break;
      }
    }
  }

  if (!rawText || !rawText.trim()) {
    logger.error('[Gemini AI] All models failed or returned empty text. Fallback applied.', {
      lastErrorMessage: lastError?.message,
    });
    return generateSmartFallbackResumeAnalysis(resumeText);
  }

  // Parse JSON response
  let parsed = null;
  try {
    let cleanJson = rawText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
    parsed = JSON.parse(cleanJson);
  } catch (parseErr) {
    logger.error('[Gemini AI] JSON parse failure on AI response:', {
      parseError: parseErr.message,
      rawText,
    });
    return generateSmartFallbackResumeAnalysis(resumeText);
  }

  return {
    overallScore: Math.min(100, Math.max(0, parseInt(parsed.overallScore, 10) || 65)),
    atsScore: Math.min(100, Math.max(0, parseInt(parsed.atsScore, 10) || 65)),
    formattingScore: Math.min(100, Math.max(0, parseInt(parsed.formattingScore, 10) || 65)),
    contentScore: Math.min(100, Math.max(0, parseInt(parsed.contentScore, 10) || 65)),
    skillsScore: Math.min(100, Math.max(0, parseInt(parsed.skillsScore, 10) || 65)),
    projectsScore: Math.min(100, Math.max(0, parseInt(parsed.projectsScore, 10) || 65)),
    experienceScore: Math.min(100, Math.max(0, parseInt(parsed.experienceScore, 10) || 65)),
    educationScore: Math.min(100, Math.max(0, parseInt(parsed.educationScore, 10) || 65)),
    grammarScore: Math.min(100, Math.max(0, parseInt(parsed.grammarScore, 10) || 65)),
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
    recommendedSkills: Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : [],
    recommendedProjects: Array.isArray(parsed.recommendedProjects) ? parsed.recommendedProjects : [],
    atsIssues: Array.isArray(parsed.atsIssues) ? parsed.atsIssues : [],
    improvementSuggestions: Array.isArray(parsed.improvementSuggestions)
      ? parsed.improvementSuggestions
      : Array.isArray(parsed.suggestions)
      ? parsed.suggestions
      : [],
    summary: typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim()
      : 'Candidate profile evaluated by Senior Recruiter AI engine.',
  };
};

module.exports = { analyzeResumeWithGemini };
