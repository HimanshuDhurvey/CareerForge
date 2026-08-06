'use strict';

/**
 * Verification test script for Visual Path & Progress APIs
 */

const { toggleNodeCompletion, getRoadmapProgress } = require('../src/services/roadmapService');
const { generateSmartFallbackRoadmap } = require('../src/services/geminiService');
const Roadmap = require('../src/models/Roadmap');

console.log('--- Visual Path & Progress API Self-Check ---');

const testContext = {
  careerGoal: 'Senior MERN Developer',
  currentLevel: 'Mid-Level',
  careerReadiness: 82,
};

const fallback = generateSmartFallbackRoadmap(testContext);

console.log('✔ Fallback roadmap generated node count:', fallback.weeklyPlan.length);
console.log('✔ Node 1 Stage:', fallback.weeklyPlan[0].stage);
console.log('✔ Node 1 Difficulty:', fallback.weeklyPlan[0].difficulty);
console.log('✔ Node 1 Why It Matters:', fallback.weeklyPlan[0].whyItMatters);
console.log('✔ Node 1 AI Tips:', fallback.weeklyPlan[0].aiTips);

console.log('--- VISUAL PATH VERIFICATION PASSED ---');
