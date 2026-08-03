/**
 * interviewTypes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for:
 *   - Interview type cards (Home + Setup)
 *   - Experience levels, difficulty levels (Setup Step 2)
 *   - Question count options, answer modes (Setup Step 3)
 *   - Pre-session instructions (Instructions page)
 *   - Quick tips (Home page sidebar)
 *   - Sort options (History page)
 *
 * Future migration:
 *   const interviewTypes = await interviewService.getInterviewTypes();
 */

import {
  Code2,
  Users,
  Building2,
  Cpu,
  Sparkles,
  FileText,
  Mic,
  VolumeX,
  RefreshCw,
  ShieldCheck,
  Timer,
} from 'lucide-react';

// ─── Interview type cards (InterviewHome) ─────────────────────────────────────

/**
 * Interview type definitions used by InterviewTypeCard in the Home page.
 * `iconName` is a string so it can be resolved dynamically from lucide-react.
 */
export const INTERVIEW_TYPES = [
  {
    id: 'technical',
    title: 'Technical Interview',
    description:
      'Data Structures, Algorithms, Coding challenges, and problem solving questions.',
    iconName: 'Code2',
  },
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description:
      'STAR method questions, situational analysis, culture fit, and teamwork scenarios.',
    iconName: 'Users',
  },
  {
    id: 'hr',
    title: 'HR Interview',
    description:
      'Background verification, career aspirations, salary expectations, and soft skills.',
    iconName: 'Briefcase',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description:
      'Scalability, architecture, database choices, load balancers, and system flow.',
    iconName: 'Cpu',
  },
  {
    id: 'mixed',
    title: 'Mixed Mode',
    description:
      'A customized combination of Technical, Behavioral, and HR questions in one session.',
    iconName: 'Sparkles',
  },
];

// ─── Interview type selector cards (Setup Step 3) ─────────────────────────────

/**
 * Interview focus options used in Setup wizard Step 3.
 * `icon` is the actual Lucide component reference (not a string) for direct JSX use.
 */
export const SETUP_INTERVIEW_TYPES = [
  { id: 'technical',     title: 'Technical',     icon: Code2     },
  { id: 'behavioral',    title: 'Behavioral',    icon: Users     },
  { id: 'hr',            title: 'HR General',    icon: Building2 },
  { id: 'system-design', title: 'System Design', icon: Cpu       },
  { id: 'mixed',         title: 'Mixed Mode',    icon: Sparkles  },
];

// ─── Experience levels (Setup Step 2) ────────────────────────────────────────

/** Experience level cards used in Setup wizard Step 2. */
export const EXPERIENCE_LEVELS = [
  { id: 'entry',  title: 'Entry Level', desc: '0-2 years, internship or graduate' },
  { id: 'mid',    title: 'Mid Level',   desc: '2-5 years, independent scope'      },
  { id: 'senior', title: 'Senior Tier', desc: '5-8 years, architect & leader'     },
  { id: 'lead',   title: 'Lead / Staff', desc: '8+ years, strategy & design'      },
];

// ─── Difficulty levels (Setup Step 2) ────────────────────────────────────────

/** Difficulty cards used in Setup wizard Step 2. */
export const DIFFICULTY_LEVELS = [
  { id: 'easy',   title: 'Easy',   desc: 'Warmup queries'    },
  { id: 'medium', title: 'Medium', desc: 'Standard loops'    },
  { id: 'hard',   title: 'Hard',   desc: 'Complex problems'  },
];

// ─── Question count options (Setup Step 3) ───────────────────────────────────

/** Available question count choices used in Setup wizard Step 3. */
export const QUESTION_COUNT_OPTIONS = [5, 10, 15];

// ─── Answer modes (Setup Step 3) ─────────────────────────────────────────────

/** Answer mode cards used in Setup wizard Step 3. */
export const ANSWER_MODES = [
  { id: 'text',  title: 'Text Mode',  desc: 'Type your responses',  icon: FileText },
  { id: 'voice', title: 'Voice Mode', desc: 'Speak into microphone', icon: Mic      },
];

// ─── Pre-session instructions (Instructions page) ────────────────────────────

/**
 * Static instruction items displayed on the InterviewInstructions page.
 * `icon` is the actual Lucide component reference.
 */
export const INSTRUCTIONS = [
  { icon: VolumeX,     text: 'Find a quiet place free from distractions before starting.' },
  { icon: RefreshCw,   text: 'Avoid refreshing or closing the page — your progress may be lost.' },
  { icon: ShieldCheck, text: 'Answer honestly; this helps AI generate accurate feedback for you.' },
  { icon: Timer,       text: 'The timer starts automatically once you click "Begin Interview".' },
];

// ─── History page sort options ────────────────────────────────────────────────

/** Sort options for the InterviewHistory filter bar. */
export const SORT_OPTIONS = [
  { label: 'Latest First',  key: 'latest'    },
  { label: 'Oldest First',  key: 'oldest'    },
  { label: 'Highest Score', key: 'scoreDesc' },
  { label: 'Lowest Score',  key: 'scoreAsc'  },
];

// ─── Filter label options (History page) ─────────────────────────────────────

/** Difficulty filter options for the History page. */
export const DIFFICULTY_FILTER_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];

/** Interview type filter options for the History page. */
export const TYPE_FILTER_OPTIONS = [
  'All',
  'Technical',
  'Behavioral',
  'HR',
  'System Design',
  'Mixed',
];

// ─── Quick tips (Home page sidebar) ──────────────────────────────────────────

/** Interview prep tips shown in the Home page right sidebar. */
export const QUICK_TIPS = [
  'Practice regularly to reduce anxiety and build natural muscle memory.',
  'Answer confidently and construct your replies using the STAR method.',
  'Think before speaking: take a 5-second pause to structure your thoughts.',
  'Keep your explanations concise and focus on the impact of your actions.',
];
