/**
 * companies.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for all company data used across the interview feature.
 *
 * Future migration:
 *   const companies = await interviewService.getCompanies();
 */

import { Building2 } from 'lucide-react';

// ─── Full company list ────────────────────────────────────────────────────────

/** All companies available for interview simulation. */
export const COMPANIES = [
  'Google',
  'Amazon',
  'Microsoft',
  'Apple',
  'Meta',
  'Netflix',
  'Adobe',
  'Flipkart',
  'Airbnb',
  'Stripe',
  'Uber',
  'Atlassian',
  'Zomato',
];

// ─── Quick-select cards (Setup Step 1) ───────────────────────────────────────

/**
 * Subset of popular companies shown as quick-select cards in the Setup wizard.
 * Each entry includes the Lucide icon component to render.
 */
export const POPULAR_COMPANIES = [
  { name: 'Google',    icon: Building2 },
  { name: 'Meta',      icon: Building2 },
  { name: 'Amazon',    icon: Building2 },
  { name: 'Netflix',   icon: Building2 },
];
