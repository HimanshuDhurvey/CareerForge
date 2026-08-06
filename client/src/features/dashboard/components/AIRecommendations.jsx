import React from 'react';
import { ChevronRight, Sparkles, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AIRecommendations({ recommendations }) {
  const navigate = useNavigate();

  const recList = recommendations || [
    'Add quantified impact metrics (%, $, user scale, latency reduction) to your work experience.',
    'Include direct GitHub repository and LinkedIn profile links in header.',
    'Practice high-frequency React Hooks and State Management interview questions.',
    'Build a microservices task queue project featuring Redis and WebSockets.',
    'Strengthen system design concepts for API rate limiting and indexing.',
  ];

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs text-left transition-colors theme-transition flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2 text-purple-500">
          <Sparkles className="h-4.5 w-4.5" />
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
            Top AI Recommendations
          </h3>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 uppercase">
          AI Action Steps
        </span>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3 flex-1">
        {recList.map((recText, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 border border-[#E5E7EB] dark:border-gray-800/80 bg-white dark:bg-[#111827] hover:bg-purple-50/40 dark:hover:bg-purple-950/20 rounded-xl transition-colors cursor-pointer group"
            onClick={() => navigate('/resume')}
          >
            <span className="shrink-0 w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-extrabold mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
              {recText}
            </p>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-purple-500 transition-colors shrink-0 mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
