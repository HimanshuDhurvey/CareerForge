import React from 'react';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

export default function QuickTipsCard({ tips }) {
  if (!tips || tips.length === 0) return null;

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-colors">
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500 rounded-xl shrink-0">
          <Lightbulb className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white tracking-tight">
            Interview Prep Tips
          </h3>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-tight">
            Boost your interview success
          </p>
        </div>
      </div>

      {/* Tips List */}
      <ul className="space-y-4 pt-4">
        {tips.map((tip, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold leading-relaxed">
              {tip}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
