import React from 'react';
import { Play, Clock, Building2, Briefcase } from 'lucide-react';

export default function ContinueInterviewCard({ interview, onContinue }) {
  if (!interview) return null;

  const { company, role, progress, lastUpdated } = interview;

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
      <div className="space-y-4 flex-1">
        {/* Header Tag */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-500 uppercase tracking-wide">
            In Progress
          </span>
          <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 font-medium">
            <Clock className="h-3.5 w-3.5" />
            Last active {lastUpdated}
          </span>
        </div>

        {/* Company and Role */}
        <div>
          <h3 className="text-lg font-bold text-[#111111] dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400 shrink-0" />
            {company}
          </h3>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
            <Briefcase className="h-4 w-4 text-gray-400 shrink-0" />
            {role}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400">
            <span>Interview Progress</span>
            <span>{progress}% Completed</span>
          </div>
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#60A5FA] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onContinue}
        className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
      >
        <Play className="h-4 w-4 fill-current" />
        Continue Interview
      </button>
    </div>
  );
}
