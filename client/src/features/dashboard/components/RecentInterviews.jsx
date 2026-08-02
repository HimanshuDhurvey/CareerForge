import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import googleLogo from '../../../assets/google.jpg';

export default function RecentInterviews({ recentInterviews }) {
  const navigate = useNavigate();
  // Simple rendering of custom icons/logos
  const renderCompanyIcon = (company) => {
    switch (company.toLowerCase()) {
      case 'google':
        return <img src={googleLogo} alt="Google" className="h-6 w-6 object-contain" />;
      case 'microsoft':
        return (
          <svg className="h-5 w-5 fill-current text-gray-500" viewBox="0 0 23 23">
            <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
          </svg>
        );
      case 'amazon':
      default:
        return (
          <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-md">
            aZ
          </span>
        );
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
          Recent Interviews
        </h3>
        <button
          onClick={() => navigate('/ai-interviews/history')}
          className="text-blue-500 hover:text-blue-600 text-xs font-bold cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {recentInterviews.map((interview) => (
          <div 
            key={interview.id} 
            className="flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-gray-800/80 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 shrink-0">
                {renderCompanyIcon(interview.company)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#111111] dark:text-white leading-tight">
                  {interview.company}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-normal">
                  {interview.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Score pill */}
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                {interview.score}%
              </span>
              
              <div className="text-right hidden xs:block">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                  {interview.date}
                </span>
              </div>

              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
