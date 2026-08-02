import React from 'react';

/**
 * ScoreRing
 * A clean SVG circular gauge displaying a percentage score.
 * Props:
 *   score      – number 0-100
 *   size       – diameter in px (default 120)
 *   strokeWidth – stroke width in px (default 10)
 *   color      – stroke color class or hex (default '#60A5FA')
 *   label      – text beneath the number
 */
export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 10,
  color = '#60A5FA',
  label = '',
}) {
  const radius   = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset   = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 85) return '#10B981'; // emerald
    if (s >= 70) return '#60A5FA'; // blue
    if (s >= 55) return '#F59E0B'; // amber
    return '#EF4444';              // red
  };

  const ringColor = color === 'auto' ? getColor(score) : color;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 dark:text-gray-800"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      {/* Overlaid score text - we use absolute positioning trick via a wrapper */}
      <div className="flex flex-col items-center -mt-2">
        <span className="text-2xl font-extrabold text-[#111111] dark:text-white tabular-nums leading-none">
          {score}
          <span className="text-sm font-bold text-gray-400">%</span>
        </span>
        {label && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
