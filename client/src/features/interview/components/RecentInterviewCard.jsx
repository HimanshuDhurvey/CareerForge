import React from 'react';
import { Calendar, Building2, ChevronRight } from 'lucide-react';

export default function RecentInterviewCard({ interview, onClick }) {
  if (!interview) return null;

  const { company, role, score, date } = interview;

  // Determine color scheme based on the score value
  const getScoreStyles = (val) => {
    if (val >= 85) {
      return {
        badge: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400",
        label: "Excellent"
      };
    } else if (val >= 70) {
      return {
        badge: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
        label: "Good"
      };
    } else {
      return {
        badge: "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400",
        label: "Needs Work"
      };
    }
  };

  const scoreStyles = getScoreStyles(score);

  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4 hover:border-gray-300 dark:hover:border-gray-700 transition-colors cursor-pointer group"
    >
      {/* Company Icon & Name */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 shrink-0">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight">
            {company}
          </h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
            {role}
          </p>
        </div>
      </div>

      {/* Score Badge and Date info */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400">Date:</span>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="h-3 w-3 shrink-0" />
              {date}
            </span>
          </div>
        </div>

        {/* Score Display Circle/Badge */}
        <div className={`px-3 py-1.5 rounded-lg text-center shrink-0 ${scoreStyles.badge}`}>
          <div className="text-xs font-extrabold">{score}%</div>
          <div className="text-[8px] font-bold uppercase tracking-wide opacity-80">{scoreStyles.label}</div>
        </div>

        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors" />
      </div>
    </div>
  );
}
