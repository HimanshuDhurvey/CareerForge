/**
 * interviewHistory.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all interview history entries.
 *
 * Shared by:
 *   - InterviewHistory page  (full list with filters)
 *   - InterviewHome page     (recent 3 entries via slice)
 *   - Dashboard              (can import recentInterviews slice here too)
 *
 * Each entry shape:
 *   { id, company, role, type, score, difficulty, date, duration }
 *
 * Future migration:
 *   const interviewHistory = await interviewService.getInterviewHistory();
 */

// ─── Full history list ────────────────────────────────────────────────────────

/**
 * Complete list of past interview sessions, ordered newest-first (id desc).
 */
export const INTERVIEW_HISTORY = [
  { id: 1,  company: 'Google',    role: 'Frontend Engineer',      type: 'Technical',     score: 82, difficulty: 'Medium', date: 'Aug 3, 2026',  duration: '28 mins' },
  { id: 2,  company: 'Amazon',    role: 'SDE II',                 type: 'Behavioral',    score: 74, difficulty: 'Hard',   date: 'Aug 1, 2026',  duration: '22 mins' },
  { id: 3,  company: 'Microsoft', role: 'Software Engineer',      type: 'Mixed',         score: 91, difficulty: 'Hard',   date: 'Jul 29, 2026', duration: '35 mins' },
  { id: 4,  company: 'Meta',      role: 'React Developer',        type: 'Technical',     score: 68, difficulty: 'Medium', date: 'Jul 25, 2026', duration: '30 mins' },
  { id: 5,  company: 'Netflix',   role: 'UI Engineer',            type: 'System Design', score: 79, difficulty: 'Hard',   date: 'Jul 22, 2026', duration: '40 mins' },
  { id: 6,  company: 'Apple',     role: 'iOS Developer',          type: 'Technical',     score: 88, difficulty: 'Medium', date: 'Jul 19, 2026', duration: '32 mins' },
  { id: 7,  company: 'Flipkart',  role: 'Full Stack Developer',   type: 'HR',            score: 95, difficulty: 'Easy',   date: 'Jul 15, 2026', duration: '18 mins' },
  { id: 8,  company: 'Airbnb',    role: 'Frontend Developer',     type: 'Behavioral',    score: 61, difficulty: 'Medium', date: 'Jul 12, 2026', duration: '24 mins' },
  { id: 9,  company: 'Stripe',    role: 'Software Engineer',      type: 'Technical',     score: 85, difficulty: 'Hard',   date: 'Jul 9, 2026',  duration: '29 mins' },
  { id: 10, company: 'Uber',      role: 'Backend Engineer',       type: 'System Design', score: 72, difficulty: 'Hard',   date: 'Jul 5, 2026',  duration: '38 mins' },
  { id: 11, company: 'Atlassian', role: 'Product Engineer',       type: 'Mixed',         score: 77, difficulty: 'Medium', date: 'Jul 1, 2026',  duration: '33 mins' },
  { id: 12, company: 'Zomato',    role: 'React Native Developer', type: 'Technical',     score: 55, difficulty: 'Easy',   date: 'Jun 27, 2026', duration: '20 mins' },
];

// ─── Derived helpers ──────────────────────────────────────────────────────────

/**
 * The 3 most recent interviews for the Home page "Recent Interviews" section.
 * Derived from INTERVIEW_HISTORY to avoid data duplication.
 */
export const RECENT_INTERVIEWS = INTERVIEW_HISTORY.slice(0, 3);

/**
 * Unique company names extracted from history, used for the History page filter.
 * Prefixed with 'All' for the default "no filter" state.
 */
export const COMPANY_FILTER_OPTIONS = [
  'All',
  ...Array.from(new Set(INTERVIEW_HISTORY.map((i) => i.company))),
];
