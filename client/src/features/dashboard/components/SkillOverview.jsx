import React from 'react';
import { Zap, AlertTriangle } from 'lucide-react';

export default function SkillOverview({ skillAnalysis }) {
  const strongSkills = skillAnalysis?.strongSkills || [
    { name: 'JavaScript / Node.js', score: 85 },
    { name: 'React.js Frontend', score: 82 },
    { name: 'REST API & Express', score: 80 },
  ];

  const weakSkills = skillAnalysis?.weakSkills || [
    { name: 'System Design & Scalability', score: 55 },
    { name: 'Quantified Project Metrics', score: 48 },
    { name: 'Cloud & Docker Deployment', score: 50 },
  ];

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs text-left transition-colors theme-transition space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
          AI Skill Analysis
        </h3>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-500 uppercase">
          Proficiency Ratings
        </span>
      </div>

      {/* Strong Skills */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-extrabold uppercase tracking-wider">
          <Zap className="h-4 w-4" />
          <span>Top Strong Skills</span>
        </div>
        <div className="space-y-2.5">
          {strongSkills.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                <span className="text-emerald-500 font-extrabold tabular-nums">{s.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Skills */}
      <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-extrabold uppercase tracking-wider">
          <AlertTriangle className="h-4 w-4" />
          <span>Target Areas to Improve</span>
        </div>
        <div className="space-y-2.5">
          {weakSkills.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-700 dark:text-gray-300">{s.name}</span>
                <span className="text-amber-500 font-extrabold tabular-nums">{s.score}%</span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
