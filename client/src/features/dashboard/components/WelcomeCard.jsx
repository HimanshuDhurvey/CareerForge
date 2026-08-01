import React from 'react';
import { Flame } from 'lucide-react';

export default function WelcomeCard({ userName }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm transition-colors theme-transition text-left">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Let's continue your journey towards your dream career.
        </p>
      </div>

      {/* Flame Streak Indicator */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl self-start sm:self-center">
        <div className="p-1.5 bg-amber-500 text-white rounded-lg animate-pulse-none">
          <Flame className="h-4.5 w-4.5 fill-current" />
        </div>
        <div className="text-xs">
          <p className="font-extrabold text-amber-800 dark:text-amber-400">You're on fire! 🔥</p>
          <p className="font-medium text-amber-600 dark:text-amber-500">14 day streak</p>
        </div>
      </div>
    </div>
  );
}
