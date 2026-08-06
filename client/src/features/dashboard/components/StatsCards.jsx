import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, FileText, Target, Award, ArrowUpRight } from 'lucide-react';

export default function StatsCards({ resumeCard, interviewCard, careerReadinessScore }) {
  const navigate = useNavigate();

  const stats = [
    {
      id: 'interviews',
      title: 'Total Interviews',
      value: interviewCard?.completedInterviews ?? 0,
      unit: 'completed',
      trend: interviewCard?.averageScore ? `Avg Score: ${interviewCard.averageScore}%` : 'Take first interview',
      icon: Video,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 border-indigo-100 dark:border-indigo-900/30',
      link: '/ai-interviews/history',
    },
    {
      id: 'resume',
      title: 'Latest Resume Score',
      value: resumeCard?.latestResumeScore !== null ? `${resumeCard.latestResumeScore}%` : 'N/A',
      unit: resumeCard?.latestResumeScore !== null ? 'Quality Rating' : 'Upload Resume',
      trend: resumeCard?.hasResume ? 'AI Evaluated' : 'Upload your first resume.',
      icon: FileText,
      bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 border-amber-100 dark:border-amber-900/30',
      link: '/resume',
    },
    {
      id: 'ats',
      title: 'ATS Compatibility',
      value: resumeCard?.latestAtsScore !== null ? `${resumeCard.latestAtsScore}%` : 'N/A',
      unit: 'Screener Rating',
      trend: resumeCard?.latestAtsScore ? 'Optimized' : 'Run ATS screener',
      icon: Target,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border-emerald-100 dark:border-emerald-900/30',
      link: '/resume',
    },
    {
      id: 'readiness',
      title: 'Career Readiness Score',
      value: careerReadinessScore !== null ? `${careerReadinessScore}%` : 'N/A',
      unit: 'Overall Rating',
      trend: careerReadinessScore !== null ? 'Ready for Interviews' : 'Complete activities',
      icon: Award,
      bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 border-blue-100 dark:border-blue-900/30',
      link: '/profile',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-left">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            onClick={() => navigate(stat.link)}
            className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500/50 rounded-2xl shadow-xs transition-all cursor-pointer space-y-4 group"
          >
            {/* Header: Icon & Link Arrow */}
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                <Icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors" />
            </div>

            {/* Metrics */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 block uppercase tracking-widest">
                {stat.title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#111111] dark:text-white tabular-nums">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {stat.unit}
                </span>
              </div>
            </div>

            {/* Footer Trend */}
            <div className="pt-2.5 border-t border-gray-100 dark:border-gray-800/80">
              <span className="text-xs font-extrabold text-blue-500 dark:text-blue-400">
                {stat.trend}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
