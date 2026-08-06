import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Briefcase,
  Tag,
  Gauge,
  CalendarDays,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

// ─── Score colour helpers ─────────────────────────────────────────────────────
function getScoreStyle(score) {
  if (score >= 85) return { ring: 'border-emerald-400 dark:border-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
  if (score >= 70) return { ring: 'border-[#60A5FA]', text: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' };
  if (score >= 55) return { ring: 'border-amber-400 dark:border-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30' };
  return { ring: 'border-red-400 dark:border-red-500', text: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' };
}

function getDifficultyStyle(level) {
  switch (level?.toLowerCase()) {
    case 'easy':  return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50';
    case 'hard':  return 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50';
    default:      return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/50';
  }
}

function getTypeStyle(type) {
  const map = {
    Technical:   'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/50',
    Behavioral:  'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/50',
    'HR':        'bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/50',
    'System Design': 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/50',
    Mixed:       'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/50',
  };
  return map[type] ?? 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700';
}

// ─── Single history card ──────────────────────────────────────────────────────
/**
 * HistoryCard
 * Props:
 *   interview – { id, company, role, type, score, difficulty, date, duration }
 */
export default function HistoryCard({ interview }) {
  const navigate = useNavigate();
  const score = getScoreStyle(interview.score);

  return (
    <article className="group bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#60A5FA]/40 dark:hover:border-[#60A5FA]/30 transition-all duration-200 flex flex-col gap-4">

      {/* ── Top row: company + score ring ─────────────────────────────── */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[#60A5FA] mb-1">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest truncate">
              {interview.company}
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight truncate">
            {interview.role}
          </h3>
        </div>

        {/* Score circle */}
        <div className={`shrink-0 w-14 h-14 rounded-2xl border-2 ${score.ring} ${score.bg} flex flex-col items-center justify-center`}>
          <span className={`text-base font-extrabold tabular-nums leading-none ${score.text}`}>
            {interview.score}
          </span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Score</span>
        </div>
      </div>

      {/* ── Badge row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${getTypeStyle(interview.type)}`}>
          <Tag className="h-2.5 w-2.5" />
          {interview.type}
        </span>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold ${getDifficultyStyle(interview.difficulty)}`}>
          <Gauge className="h-2.5 w-2.5" />
          {interview.difficulty}
        </span>
      </div>

      {/* ── Meta row ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-3 w-3" />
          {interview.date}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3 w-3" />
          {interview.duration}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 dark:border-gray-800" />

      {/* ── CTA button ───────────────────────────────────────────────── */}
      <button
        onClick={() => navigate(`/ai-interviews/details/${interview.id}`)}
        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-gray-50 dark:bg-gray-800/40 hover:bg-[#60A5FA] hover:text-white dark:hover:bg-[#60A5FA] text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-[#60A5FA] font-bold text-xs rounded-xl transition-all duration-200 cursor-pointer"
      >
        <TrendingUp className="h-3.5 w-3.5" />
        View Details & Answers
        <ChevronRight className="h-3.5 w-3.5 ml-auto" />
      </button>
    </article>
  );
}
