import React from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SkillsCard({ skills }) {
  const handleManageSkills = () => {
    toast.success("Skill management modal is simulated (UI only).");
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
          Key Skills
        </h3>
        <button 
          onClick={handleManageSkills}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-xs font-bold transition-colors cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Manage Skills</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <span 
            key={idx}
            className="px-3.5 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700/60 rounded-full text-xs font-bold hover:border-blue-400 dark:hover:border-blue-400/50 hover:text-blue-500 dark:hover:text-blue-400 transition-all select-none"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
