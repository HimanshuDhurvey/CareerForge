/**
 * currentInterview.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for the currently active (in-progress) interview.
 *
 * Used by:
 *   - InterviewHome page (ContinueInterviewCard)
 *
 * Future migration:
 *   const currentInterview = await interviewService.getCurrentInterview(userId);
 *   // Returns null if no interview is in progress.
 */

// ─── Active Interview ─────────────────────────────────────────────────────────

/**
 * The currently in-progress mock interview session.
 * Set to `null` to hide the ContinueInterviewCard on the Home page.
 */
export const CURRENT_INTERVIEW = {
  company:         'Google',
  role:            'Frontend Engineer',
  interviewType:   'Technical',
  difficulty:      'Medium',
  currentQuestion: 3,
  totalQuestions:  5,
  estimatedTime:   '30 mins',
  progress:        60,       // percentage (0-100)
  lastUpdated:     '2 hours ago',
};
