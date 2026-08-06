'use strict';

/**
 * roadmapPromptBuilder.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Constructs a structured prompt for Gemini AI to generate a highly customized,
 * actionable 6-to-12-week Career Roadmap based on candidate telemetry.
 */

/**
 * Build prompt string for Gemini API.
 *
 * @param {Object} context Aggregated profile, resume analysis, and interview evaluation data
 * @returns {string} Fully formatted prompt string
 */
function buildRoadmapPrompt(context) {
  const {
    careerGoal,
    currentLevel,
    careerReadiness,
    profile,
    resumeAnalysis,
    interviewEvaluation,
    strongSkills = [],
    weaknesses = [],
    recommendedSkills = [],
    recommendedProjects = [],
  } = context;

  const targetCompany = profile?.targetCompany || 'Top Tech Companies / FAANG';
  const degree = profile?.degree ? `${profile.degree} in ${profile.branch || 'CS/IT'}` : 'Computer Science / Engineering';

  return `
You are an Elite Tech Career Architect, Senior Staff Engineer, and Hiring Manager creating an individualized, high-impact career growth roadmap for a software candidate.

### Candidate Context & Telemetry
- Target Career Goal: ${careerGoal}
- Target Company / Tier: ${targetCompany}
- Current Level Assessment: ${currentLevel}
- Current Career Readiness Score: ${careerReadiness}%
- Academic Background: ${degree}

### Key Strengths & Verified Skills:
${strongSkills.length > 0 ? strongSkills.map((s) => `- ${s}`).join('\n') : '- Solid foundational programming & problem solving'}

### Identified Skill Gaps & Weaknesses (Resume & Interview Analysis):
${weaknesses.length > 0 ? weaknesses.map((w) => `- ${w}`).join('\n') : '- System design scale, performance optimization, and deep architectural trade-offs'}

### Recommended Core Skills to Master:
${recommendedSkills.length > 0 ? recommendedSkills.map((rs) => `- ${rs}`).join('\n') : '- Cloud Architecture, Redis Caching, Docker & CI/CD, Microservices'}

### Candidate Project Gaps:
${recommendedProjects.length > 0 ? recommendedProjects.map((rp) => `- ${rp}`).join('\n') : '- High-scale distributed service with asynchronous queues and real-time streaming'}

### Direct Instructions & Guidelines:
1. Generate a realistic, weekly milestone roadmap (6 to 8 weeks) tailored specifically to address the candidate's weaknesses and propel them to their target career goal (${careerGoal}).
2. For each week, provide a clear title, objective description, specific skills covered, concrete learning resources (Documentation, Video, Practice links), a practical hands-on mini-project, and realistic estimated hours.
3. Include recruiter-style high-level career summary text providing executive guidance.
4. Recommend top industry certifications relevant to ${careerGoal}.
5. Group the roadmap into sequential stages (e.g. Stage 1: Programming Fundamentals, Stage 2: Core Stack Architecture, Stage 3: Systems & Data, Stage 4: Cloud & Microservices, Stage 5: Advanced Scaling, Stage 6: Capstone Portfolio, Stage 7: FAANG Interview Prep).
6. For each week node, include "stage", "difficulty" (Beginner | Intermediate | Advanced), "whyItMatters" (career rationale), and "aiTips" (strategic practice advice).
7. You MUST return raw JSON ONLY matching the EXACT structure below without markdown code blocks, preambles, or extra text.

### STRICT JSON OUTPUT FORMAT:
{
  "careerGoal": "${careerGoal}",
  "currentLevel": "${currentLevel}",
  "careerReadiness": ${careerReadiness},
  "estimatedDuration": "8 Weeks",
  "summary": "Executive recruiter-style career summary explaining the strategy to achieve ${careerGoal}.",
  "prioritySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "recommendedProjects": ["Project 1 Title & Concept", "Project 2 Title & Concept", "Project 3 Title & Concept"],
  "recommendedCertifications": ["Cert 1", "Cert 2", "Cert 3"],
  "weeklyPlan": [
    {
      "week": 1,
      "stage": "Stage 1: Programming Fundamentals",
      "title": "Week 1 Title Focus",
      "description": "Clear weekly objective and focus.",
      "whyItMatters": "Why mastering this topic is essential for your target role.",
      "aiTips": "Key interview traps, optimization tips, and practice guidelines.",
      "difficulty": "Intermediate",
      "skills": ["Skill 1", "Skill 2"],
      "resources": [
        {
          "title": "Resource Name",
          "url": "https://developer.mozilla.org or official docs link",
          "type": "Documentation | Video | Practice"
        }
      ],
      "miniProject": "Concrete mini-project title and key feature to build this week",
      "estimatedHours": 12
    }
  ]
}
`;
}

module.exports = {
  buildRoadmapPrompt,
};
