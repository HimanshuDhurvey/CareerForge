import React from 'react';
import { User, Mail, Award, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WelcomeCard({ profileSummary, careerReadinessScore }) {
  const navigate = useNavigate();
  const userName = profileSummary?.userName || 'Candidate';
  const currentRole = profileSummary?.currentRole || 'Software Engineer';
  const email = profileSummary?.email || '';
  const completion = profileSummary?.profileCompletion || 0;
  const avatar = profileSummary?.profilePicture || '';

  return (
    <div className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs transition-colors theme-transition text-left space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {avatar ? (
              <img
                src={avatar}
                alt={userName}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500 shadow-xs"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#111827] rounded-full" />
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight truncate">
                Welcome back, {userName} 👋
              </h1>
              <CheckCircle2 className="h-4.5 w-4.5 text-blue-500 shrink-0" />
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-semibold">
              <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-extrabold">
                <User className="h-3.5 w-3.5" />
                {currentRole}
              </span>
              {email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  {email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion & Career Readiness Pill */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-100 dark:border-gray-800 pt-3 sm:pt-0 sm:pl-6 shrink-0">
          {/* Profile Completion Progress */}
          <div className="space-y-1 min-w-[120px]">
            <div className="flex justify-between text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <span>Profile Completion</span>
              <span className="text-blue-500">{completion}%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-[10px] font-extrabold text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Complete Profile →
            </button>
          </div>

          {/* Career Readiness Score Badge */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-lg shadow-xs">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                Career Readiness
              </span>
              {careerReadinessScore !== null ? (
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                  {careerReadinessScore}%
                </span>
              ) : (
                <span className="text-[10px] font-bold text-amber-500 italic block">
                  Complete more activities to calculate.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
