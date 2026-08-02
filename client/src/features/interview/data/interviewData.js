/**
 * MOCK_QUESTIONS
 * 10 realistic Technical + Behavioral mock questions.
 * In production these would come from an API / route state.
 */
export const MOCK_QUESTIONS = [
  {
    id: 1,
    type: 'Technical',
    question:
      'Explain the difference between `var`, `let`, and `const` in JavaScript. When would you prefer one over the others?',
  },
  {
    id: 2,
    type: 'Technical',
    question:
      'What is the Virtual DOM in React and how does React use it to improve rendering performance?',
  },
  {
    id: 3,
    type: 'Technical',
    question:
      'Describe the concept of closures in JavaScript and provide a practical use-case where closures are beneficial.',
  },
  {
    id: 4,
    type: 'Technical',
    question:
      'What are React Hooks? Explain the rules of Hooks and describe three commonly used built-in Hooks.',
  },
  {
    id: 5,
    type: 'Technical',
    question:
      'What is event delegation and why is it considered a performance optimisation in JavaScript?',
  },
  {
    id: 6,
    type: 'Behavioral',
    question:
      'Tell me about a time when you had to meet a tight deadline. How did you prioritise tasks and what was the outcome?',
  },
  {
    id: 7,
    type: 'Behavioral',
    question:
      "Describe a situation where you disagreed with a team member's technical decision. How did you handle it?",
  },
  {
    id: 8,
    type: 'Technical',
    question:
      'Explain the CSS Box Model. How do `box-sizing: content-box` and `box-sizing: border-box` differ?',
  },
  {
    id: 9,
    type: 'Behavioral',
    question:
      'Give an example of when you proactively identified and fixed a bug or a performance bottleneck that was outside your direct responsibility.',
  },
  {
    id: 10,
    type: 'Technical',
    question:
      'What is the difference between `localStorage`, `sessionStorage`, and cookies? When would you use each?',
  },
];

export const MOCK_SESSION = {
  company: 'Google',
  role: 'Frontend Engineer',
  difficulty: 'Medium',
  totalQuestions: MOCK_QUESTIONS.length,
  estimatedMins: 30,
};
