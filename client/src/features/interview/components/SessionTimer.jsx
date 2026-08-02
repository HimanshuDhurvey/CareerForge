import React, { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

/**
 * SessionTimer
 * Counts down from `totalSeconds` to 0. Turns red in the final 60 seconds.
 * Props:
 *   totalSeconds – initial countdown value in seconds
 *   onExpire     – callback fired when the timer reaches 0
 */
export default function SessionTimer({ totalSeconds, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [onExpire]);

  const mins = String(Math.floor(remaining / 60)).padStart(2, '0');
  const secs = String(remaining % 60).padStart(2, '0');
  const isWarning = remaining <= 60;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold tabular-nums transition-colors ${
        isWarning
          ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-500 dark:text-red-400'
          : 'bg-gray-50 dark:bg-gray-800/60 border-[#E5E7EB] dark:border-gray-800 text-[#111111] dark:text-white'
      }`}
      aria-label={`Time remaining: ${mins} minutes ${secs} seconds`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" />
      {mins}:{secs}
    </div>
  );
}
