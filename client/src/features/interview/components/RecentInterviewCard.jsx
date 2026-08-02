import React from 'react';
import { Calendar, Building2, Tag, ChevronRight } from 'lucide-react';

export default function RecentInterviewCard({ interview, onClick }) {
  if (!interview) return null;

  const { company, role, type, score, date } = interview;

  // Determine color scheme based on the score value
  const getScoreStyles = (val) => {
    if (val >= 85) {
      return {
        badge: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400',
        label: 'Excellent',
      };
    } else if (val >= 70) {
      return {
        badge: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
        label: 'Good',
      };
    } else {
      return {
        badge: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
        label: 'Needs Work',
      };
    }
  };

  // Type badge colour map
  const getTypeStyle = (t) => {
    const map = {
      Technical:       'bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400',
      Behavioral:      'bg-purple-50 dark:bg-purple-950/30 text-purple-500 dark:text-purple-400',
      HR:              'bg-teal-50 dark:bg-teal-950/30 text-teal-500 dark:text-teal-400',
      'System Design': 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 dark:text-indigo-400',
      Mixed:           'bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400',
    };
    return map[t] ?? 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500';
  };

  const scoreStyles = getScoreStyles(score);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className="
        bg-white dark:bg-[#111827]
        border border-[#E5E7EB] dark:border-gray-800
        rounded-xl p-4 shadow-xs
        flex items-center justify-between gap-4
        hover:border-[#60A5FA]/50 dark:hover:border-[#60A5FA]/40
        hover:shadow-md
        transition-all duration-200
        cursor-pointer group
      "
    >
      {/* Left: Company icon + name + role + type badge */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight truncate">
            {company}
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5 truncate">
            {role}
          </p>
          {type && (
            <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${getTypeStyle(type)}`}>
              <Tag className="h-2.5 w-2.5" />
              {type}
            </span>
          )}
        </div>
      </div>

      {/* Right: Date + Score + Arrow */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-1 justify-end text-gray-400 dark:text-gray-500">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="text-[10px] font-semibold">{date}</span>
          </div>
        </div>

        {/* Score badge */}
        <div className={`px-3 py-1.5 rounded-lg text-center shrink-0 ${scoreStyles.badge}`}>
          <div className="text-xs font-extrabold tabular-nums">{score}%</div>
          <div className="text-[8px] font-bold uppercase tracking-wide opacity-80">{scoreStyles.label}</div>
        </div>

        <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-[#60A5FA] transition-colors" />
      </div>
    </div>
  );
}
