import React from 'react';

export default function SkillOverview({ skills }) {
  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
          Skills Overview
        </h3>
        <button className="text-blue-500 hover:text-blue-600 text-xs font-bold cursor-pointer">
          View All
        </button>
      </div>

      {/* Progress Bars */}
      <div className="space-y-4">
        {skills.map((skill, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
              <span className="text-gray-500">{skill.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${skill.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
