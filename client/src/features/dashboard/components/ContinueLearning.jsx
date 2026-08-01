import React from 'react';

export default function ContinueLearning({ continueLearning }) {
  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Progress details */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                Continue Your Learning
              </span>
            </div>
            
            <div className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-[10px] font-extrabold text-blue-500 uppercase tracking-wider">
              {continueLearning.status}
            </div>

            <h3 className="text-lg font-extrabold text-[#111111] dark:text-white tracking-tight">
              {continueLearning.title}
            </h3>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-1.5 max-w-sm">
            <div className="flex justify-between text-[11px] font-bold text-gray-500">
              <span>Question {continueLearning.questionCurrent} of {continueLearning.questionTotal}</span>
              <span>{continueLearning.progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${continueLearning.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm">
              Continue Interview
            </button>
            <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs font-extrabold cursor-pointer">
              View Details &gt;
            </button>
          </div>
        </div>

        {/* Right Column: Beautiful SVG Developer Illustration */}
        <div className="md:col-span-5 hidden md:flex justify-center items-center select-none pointer-events-none">
          <svg className="w-full max-w-[180px] h-auto" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <circle cx="100" cy="80" r="70" fill="#60A5FA" fillOpacity="0.05" />
            
            {/* Coding screen */}
            <rect x="35" y="30" width="130" height="90" rx="6" fill="#F3F4F6" stroke="#E5E7EB" className="dark:fill-[#1f2937] dark:stroke-gray-800" strokeWidth="2" />
            
            {/* Screen content details */}
            <rect x="42" y="38" width="40" height="6" rx="2" fill="#9CA3AF" fillOpacity="0.5" />
            <rect x="42" y="48" width="60" height="4" rx="1" fill="#D1D5DB" fillOpacity="0.5" />
            <rect x="42" y="56" width="30" height="4" rx="1" fill="#D1D5DB" fillOpacity="0.5" />
            <rect x="42" y="64" width="45" height="4" rx="1" fill="#D1D5DB" fillOpacity="0.5" />
            
            {/* Small interactive cards floated */}
            {/* Code bracket tag card */}
            <rect x="15" y="55" width="28" height="24" rx="6" fill="#EFF6FF" className="dark:fill-[#1e3a8a]/40" stroke="#3B82F6" strokeWidth="1.5" />
            <text x="21" y="71" fill="#3B82F6" fontSize="11" fontWeight="bold">&lt;/&gt;</text>
            
            {/* Video play card */}
            <rect x="150" y="50" width="28" height="24" rx="6" fill="#EFF6FF" className="dark:fill-[#1e3a8a]/40" stroke="#3B82F6" strokeWidth="1.5" />
            {/* SVG Play symbol */}
            <polygon points="161,59 161,65 166,62" fill="#3B82F6" />

            {/* Developer Character */}
            <circle cx="100" cy="65" r="14" fill="#E5E7EB" className="dark:fill-gray-700" />
            <circle cx="100" cy="63" r="11" fill="#FCA5A5" /> {/* Face */}
            <rect x="91" y="50" width="18" height="8" rx="4" fill="#1F2937" /> {/* Hair */}
            {/* Body */}
            <path d="M78 120 C78 95, 122 95, 122 120 Z" fill="#3B82F6" />
            
            {/* Laptop stand */}
            <rect x="80" y="120" width="40" height="4" fill="#9CA3AF" />
            <rect x="70" y="124" width="60" height="2" fill="#D1D5DB" />
          </svg>
        </div>
      </div>
    </div>
  );
}
