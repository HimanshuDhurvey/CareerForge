/**
 * questions.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all mock interview questions and the default
 * fallback session configuration.
 *
 * Shared by:
 *   - InterviewSession page  (active question list + session defaults)
 *   - InterviewInstructions page (DEFAULT_SESSION fallback)
 *   - Future AI integration  (swap MOCK_QUESTIONS for API-fetched questions)
 *
 * Each question shape:
 *   { id, question, type, difficulty, category }
 *
 * Future migration:
 *   const questions = await interviewService.getQuestions({ type, difficulty, count });
 */

// ─── Mock Questions ───────────────────────────────────────────────────────────

/**
 * 10 realistic Technical + Behavioral mock questions.
 * In production these would come from an API based on session configuration.
 */
export const MOCK_QUESTIONS = [
  {
    id: 1,
    type: 'Technical',
    difficulty: 'Medium',
    category: 'JavaScript',
    question:
      'Explain the difference between `var`, `let`, and `const` in JavaScript. When would you prefer one over the others?',
  },
  {
    id: 2,
    type: 'Technical',
    difficulty: 'Medium',
    category: 'React',
    question:
      'What is the Virtual DOM in React and how does React use it to improve rendering performance?',
  },
  {
    id: 3,
    type: 'Technical',
    difficulty: 'Medium',
    category: 'JavaScript',
    question:
      'Describe the concept of closures in JavaScript and provide a practical use-case where closures are beneficial.',
  },
  {
    id: 4,
    type: 'Technical',
    difficulty: 'Medium',
    category: 'React',
    question:
      'What are React Hooks? Explain the rules of Hooks and describe three commonly used built-in Hooks.',
  },
  {
    id: 5,
    type: 'Technical',
    difficulty: 'Easy',
    category: 'JavaScript',
    question:
      'What is event delegation and why is it considered a performance optimisation in JavaScript?',
  },
  {
    id: 6,
    type: 'Behavioral',
    difficulty: 'Easy',
    category: 'Teamwork',
    question:
      'Tell me about a time when you had to meet a tight deadline. How did you prioritise tasks and what was the outcome?',
  },
  {
    id: 7,
    type: 'Behavioral',
    difficulty: 'Medium',
    category: 'Conflict Resolution',
    question:
      "Describe a situation where you disagreed with a team member's technical decision. How did you handle it?",
  },
  {
    id: 8,
    type: 'Technical',
    difficulty: 'Easy',
    category: 'CSS',
    question:
      'Explain the CSS Box Model. How do `box-sizing: content-box` and `box-sizing: border-box` differ?',
  },
  {
    id: 9,
    type: 'Behavioral',
    difficulty: 'Medium',
    category: 'Initiative',
    question:
      'Give an example of when you proactively identified and fixed a bug or a performance bottleneck that was outside your direct responsibility.',
  },
  {
    id: 10,
    type: 'Technical',
    difficulty: 'Hard',
    category: 'Browser APIs',
    question:
      'What is the difference between `localStorage`, `sessionStorage`, and cookies? When would you use each?',
  },
];

// ─── Default session ──────────────────────────────────────────────────────────

/**
 * Fallback session configuration used when no route state is forwarded
 * (e.g. when navigating directly to /session or /instructions in development).
 *
 * In production, this is replaced by data from the Setup form via router state.
 */
export const DEFAULT_SESSION = {
  company:        'Google',
  role:           'Frontend Engineer',
  difficulty:     'Medium',
  numQuestions:   MOCK_QUESTIONS.length,
  interviewType:  'Technical',
  estimatedTime:  '30 mins',
  estimatedMins:  30,
};
