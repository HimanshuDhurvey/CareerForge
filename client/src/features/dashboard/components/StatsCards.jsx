import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Code2, FileText, Flame } from 'lucide-react';

export default function StatsCards({ stats }) {
  const navigate = useNavigate();
  const getIcon = (type) => {
    switch (type) {
      case 'interviews':
        return {
          icon: Video,
          bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500'
        };
      case 'coding':
        return {
          icon: Code2,
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500'
        };
      case 'resume':
        return {
          icon: FileText,
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500'
        };
      case 'streak':
      default:
        return {
          icon: Flame,
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 text-left">
      {stats.map((stat, idx) => {
        const { icon: Icon, bg } = getIcon(stat.type);
        return (
          <div 
            key={idx} 
            onClick={() => {
              if (stat.type === 'resume') {
                navigate('/profile');
              }
            }}
            className={`p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm transition-colors theme-transition space-y-4 ${
              stat.type === 'resume' ? 'cursor-pointer hover:border-blue-400 dark:hover:border-blue-400/50' : ''
            }`}
          >
            {/* Header: Icon */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bg}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>

            {/* Metrics */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block uppercase tracking-wide">
                {stat.title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#111111] dark:text-white">
                  {stat.value}
                </span>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {stat.unit}
                </span>
              </div>
            </div>

            {/* Footer Trend */}
            <div className="pt-2.5 border-t border-gray-50 dark:border-gray-800/80">
              <span className={`text-[11px] font-bold ${
                stat.type === 'streak' 
                  ? 'text-amber-500 dark:text-amber-400' 
                  : 'text-emerald-500 dark:text-emerald-400'
              }`}>
                {stat.trend}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold block">
                {stat.type === 'streak' ? 'Keep moving forward' : 'this week'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
