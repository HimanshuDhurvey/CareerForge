import React from 'react';
import { MessageSquare } from 'lucide-react';

/**
 * QuestionCard
 * Displays the current question number, type badge, and question text.
 * Props:
 *   questionNumber – 1-based index
 *   total          – total questions count
 *   type           – e.g. 'Technical' | 'Behavioral'
 *   question       – question string
 */
export default function QuestionCard({ questionNumber, total, type, question }) {
  const isBehavioral = type?.toLowerCase() === 'behavioral';

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs">
      {/* Top meta row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-[#60A5FA]">
            <MessageSquare className="h-4.5 w-4.5" />
          </div>
          <span className="text-xs font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            Question {questionNumber} of {total}
          </span>
        </div>

        {/* Type badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
            isBehavioral
              ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-500 dark:text-purple-400'
              : 'bg-blue-50 dark:bg-blue-950/30 text-blue-500 dark:text-blue-400'
          }`}
        >
          {type}
        </span>
      </div>

      {/* Question text */}
      <p className="text-base sm:text-lg font-semibold text-[#111111] dark:text-white leading-relaxed">
        {question}
      </p>
    </div>
  );
}
