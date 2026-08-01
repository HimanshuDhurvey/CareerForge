import React from 'react';
import { Target, Building, Briefcase, Network } from 'lucide-react';

export default function CareerGoalsCard({ careerGoals }) {
  const goals = [
    { label: "Dream Company", value: careerGoals.dreamCompany, icon: Building, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { label: "Target Role", value: careerGoals.targetRole, icon: Target, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { label: "Preferred Domain", value: careerGoals.preferredDomain, icon: Network, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/20" },
    { label: "Experience Level", value: careerGoals.experienceLevel, icon: Briefcase, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
        Career Goals
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {goals.map((goal, idx) => {
          const Icon = goal.icon;
          return (
            <div 
              key={idx} 
              className="p-4 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl flex flex-col justify-between items-start gap-4 transition-colors text-left"
            >
              <div className={`p-2.5 rounded-xl ${goal.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5 w-full">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
                  {goal.label}
                </span>
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-100 block truncate">
                  {goal.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
