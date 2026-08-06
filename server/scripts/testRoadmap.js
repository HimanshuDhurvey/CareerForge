'use strict';

/**
 * Verification test script for Roadmap module components
 */

const Roadmap = require('../src/models/Roadmap');
const { buildRoadmapPrompt } = require('../src/ai/roadmapPromptBuilder');
const { generateSmartFallbackRoadmap } = require('../src/services/geminiService');

console.log('--- Roadmap Component Self-Check ---');

// 1. Verify Prompt Builder
const testContext = {
  careerGoal: 'Senior MERN Developer',
  currentLevel: 'Mid-Level',
  careerReadiness: 78,
  strongSkills: ['React', 'Node.js', 'Express'],
  weaknesses: ['System Design', 'Redis Caching'],
  recommendedSkills: ['Docker', 'AWS'],
  recommendedProjects: ['Distributed Queue System'],
};

const prompt = buildRoadmapPrompt(testContext);
console.log('✔ Prompt Builder generated prompt successfully. Length:', prompt.length);

// 2. Verify Smart Fallback Engine
const fallbackOutput = generateSmartFallbackRoadmap(testContext);
console.log('✔ Fallback Engine output valid:', {
  goal: fallbackOutput.careerGoal,
  duration: fallbackOutput.estimatedDuration,
  weeksCount: fallbackOutput.weeklyPlan.length,
});

// 3. Verify Model instantiation
const testModel = new Roadmap({
  user: '507f1f77bcf86cd799439011',
  careerGoal: fallbackOutput.careerGoal,
  currentLevel: fallbackOutput.currentLevel,
  careerReadiness: fallbackOutput.careerReadiness,
  estimatedDuration: fallbackOutput.estimatedDuration,
  summary: fallbackOutput.summary,
  prioritySkills: fallbackOutput.prioritySkills,
  recommendedProjects: fallbackOutput.recommendedProjects,
  recommendedCertifications: fallbackOutput.recommendedCertifications,
  weeklyPlan: fallbackOutput.weeklyPlan,
});

const validateErr = testModel.validateSync();
if (validateErr) {
  console.error('❌ Model validation error:', validateErr);
  process.exit(1);
} else {
  console.log('✔ Roadmap Mongoose Model Schema validation passed successfully!');
}

console.log('--- ALL VERIFICATIONS PASSED ---');
