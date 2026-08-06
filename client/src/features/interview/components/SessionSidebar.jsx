import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

/**
 * SessionSidebar
 * Desktop-only right panel showing live session stats and per-question status.
 * Props:
 *   questions       – full questions array
 *   answers         – object keyed by questionId with answer strings
 *   currentIndex    – 0-based current question index
 *   estimatedMins   – original session duration in minutes
 *   remaining       – seconds remaining (passed from timer)
 *   onJump          – callback(index) to jump to a specific question
 */
export default function SessionSidebar({
  questions,
  answers,
  currentIndex,
  estimatedMins,
  onJump,
}) {
  const answered = questions.filter(q => q.isAnswered || !!answers[q.id]?.trim()).length;
  const remaining = questions.length - answered;

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-64 xl:w-72 shrink-0">

      {/* Stats card */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Session Progress
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-center">
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{answered}</div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Answered</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-center">
            <div className="text-xl font-extrabold text-[#111111] dark:text-white">{remaining}</div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Remaining</div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
          <Clock className="h-4 w-4 text-[#60A5FA] shrink-0" />
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Est. Duration</div>
            <div className="text-xs font-extrabold text-[#111111] dark:text-white">~{estimatedMins} mins</div>
          </div>
        </div>
      </div>

      {/* Question navigator */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs">
        <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Questions
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const isAnswered = q.isAnswered || !!answers[q.id]?.trim();
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => {
                  if (idx < currentIndex) return;
                  onJump(idx);
                }}
                disabled={idx < currentIndex}
                title={idx < currentIndex ? 'Cannot revisit previously submitted questions' : `Question ${idx + 1}`}
                className={`h-9 w-9 rounded-xl text-xs font-extrabold transition-colors focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:ring-offset-2 dark:focus:ring-offset-[#111827] ${
                  idx < currentIndex ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                } ${
                  isCurrent
                    ? 'bg-[#60A5FA] text-white shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-50 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-[#60A5FA] hover:text-[#60A5FA]'
                }`}
              >
                {isAnswered && !isCurrent
                  ? <CheckCircle2 className="h-3.5 w-3.5 mx-auto" />
                  : idx + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-[#60A5FA]" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 text-gray-300 dark:text-gray-600" />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Pending</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
