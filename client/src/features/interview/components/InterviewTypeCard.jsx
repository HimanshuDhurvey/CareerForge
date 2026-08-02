import React from 'react';
import * as Icons from 'lucide-react';

export default function InterviewTypeCard({ type, onSelect }) {
  if (!type) return null;

  const { id, title, description, iconName } = type;

  // Resolve the Lucide icon dynamically
  const IconComponent = Icons[iconName] || Icons.HelpCircle;

  return (
    <button
      onClick={() => onSelect && onSelect(id)}
      className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs hover:border-[#60A5FA] dark:hover:border-[#60A5FA] text-left transition-colors cursor-pointer w-full group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-[#111827]"
    >
      <div className="flex items-start gap-4">
        {/* Icon wrapper */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-[#60A5FA] shrink-0 group-hover:bg-[#60A5FA] group-hover:text-white transition-colors duration-200">
          <IconComponent className="h-6 w-6" />
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white tracking-tight flex items-center gap-1.5">
            {title}
            <Icons.ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}
