/**
 * roles.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all role data used across the interview feature.
 *
 * Future migration:
 *   const roles = await interviewService.getRoles();
 */

// ─── Full role list ───────────────────────────────────────────────────────────

/** All roles available for interview simulation. */
export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Software Engineer',
  'Data Analyst',
  'Machine Learning Engineer',
  'Product Manager',
  'Data Scientist',
  'iOS Developer',
  'React Native Developer',
  'UI Engineer',
  'Product Engineer',
];

// ─── Quick-select chips (Setup Step 1) ───────────────────────────────────────

/**
 * Subset of popular roles shown as quick-select chips in the Setup wizard.
 */
export const POPULAR_ROLES = [
  'Frontend Engineer',
  'Backend Engineer',
  'Fullstack Engineer',
  'Product Manager',
  'Data Scientist',
];
