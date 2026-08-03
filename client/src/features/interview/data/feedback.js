/**
 * feedback.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for mock interview feedback data.
 *
 * Used by:
 *   - InterviewFeedback page (as fallback when no route state is present)
 *
 * Shape:
 *   MOCK_FEEDBACK = {
 *     session:           { company, role, difficulty, totalQuestions, answeredQuestions, date }
 *     scores:            { overall, technical, communication, confidence, problemSolving }
 *     strengths:         string[]
 *     weaknesses:        string[]
 *     aiSuggestions:     string[]
 *     recommendedTopics: string[]
 *   }
 *
 * Future migration:
 *   const feedback = await interviewService.getFeedback(sessionId);
 */

// ─── Mock Feedback ────────────────────────────────────────────────────────────

export const MOCK_FEEDBACK = {
  session: {
    company:           'Google',
    role:              'Frontend Engineer',
    difficulty:        'Medium',
    totalQuestions:    10,
    answeredQuestions: 9,
    date:              'Aug 3, 2026',
  },

  scores: {
    overall:        82,
    technical:      85,
    communication:  78,
    confidence:     74,
    problemSolving: 88,
  },

  strengths: [
    'Strong grasp of React core concepts including Hooks and the Virtual DOM lifecycle.',
    'Clear, structured explanations that are easy to follow and logically sequenced.',
    'Excellent problem-solving approach — you broke down complex topics methodically.',
    'Demonstrated real-world application by citing practical use-cases effectively.',
  ],

  weaknesses: [
    'CSS-related answers lacked depth; the Box Model explanation was brief.',
    'Communication score dipped on Behavioral questions — answers could be more structured using the STAR method.',
    'Confidence in system-level topics (localStorage, sessionStorage) needs reinforcement.',
  ],

  aiSuggestions: [
    'Practise the STAR (Situation, Task, Action, Result) method for every Behavioral question to add structure and impact.',
    'Deep-dive into CSS layout techniques — Flexbox, Grid, and the Box Model — as these appear frequently in Frontend interviews.',
    'Study browser storage mechanisms (localStorage, sessionStorage, cookies, IndexedDB) and their security implications.',
    'Work on conciseness — aim for 90-second answers that lead with the conclusion, then elaborate with examples.',
    'Schedule a Mixed-mode session next to balance Technical and Behavioral performance together.',
  ],

  recommendedTopics: [
    'CSS Box Model & Layouts',
    'STAR Method',
    'Browser Storage APIs',
    'Async JavaScript',
    'React Performance',
    'System Design Basics',
    'REST & HTTP',
    'Accessibility (a11y)',
  ],
};
