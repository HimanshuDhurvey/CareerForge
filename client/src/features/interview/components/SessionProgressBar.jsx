import React from 'react';

/**
 * SessionProgressBar
 * Full-width linear progress strip at the very top of the session layout.
 * Props:
 *   current  – 1-based current question index
 *   total    – total number of questions
 */
export default function SessionProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
      <div
        className="h-full bg-[#60A5FA] rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
      />
    </div>
  );
}
