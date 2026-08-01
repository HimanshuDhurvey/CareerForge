import React from 'react';
import { ChevronRight, Atom, Database, Server } from 'lucide-react';

export default function AIRecommendations({ aiRecommendations }) {
  const getRecommendationIcon = (title) => {
    const text = title.toLowerCase();
    if (text.includes('react') || text.includes('hook')) {
      return <Atom className="h-5 w-5 text-[#60A5FA]" />;
    }
    if (text.includes('dbms') || text.includes('database')) {
      return <Database className="h-5 w-5 text-emerald-500" />;
    }
    return <Server className="h-5 w-5 text-indigo-500" />;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20';
      case 'medium':
      default:
        return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
          AI Recommendations
        </h3>
        <button className="text-blue-500 hover:text-blue-600 text-xs font-bold cursor-pointer">
          View All
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {aiRecommendations.map((rec) => (
          <div 
            key={rec.id} 
            className="flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-gray-800/80 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 shrink-0">
                {getRecommendationIcon(rec.title)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                  {rec.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                  <span className="text-[9.5px] text-gray-400 dark:text-gray-500 font-semibold">
                    {rec.time}
                  </span>
                </div>
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        ))}
      </div>
    </div>
  );
}
