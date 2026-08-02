import React from 'react';

/**
 * ScoreBar
 * A labelled horizontal progress bar for sub-scores.
 * Props:
 *   label  – category name string
 *   score  – number 0-100
 *   icon   – optional Lucide icon component
 */
export default function ScoreBar({ label, score, icon: Icon }) {
  const getColor = (s) => {
    if (s >= 85) return 'bg-emerald-500';
    if (s >= 70) return 'bg-[#60A5FA]';
    if (s >= 55) return 'bg-amber-400';
    return 'bg-red-400';
  };

  const getTextColor = (s) => {
    if (s >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (s >= 70) return 'text-blue-500 dark:text-blue-400';
    if (s >= 55) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
          <span className="text-xs font-bold">{label}</span>
        </div>
        <span className={`text-xs font-extrabold tabular-nums ${getTextColor(score)}`}>
          {score}%
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor(score)} rounded-full transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
