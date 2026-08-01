import React, { useState } from 'react';
import { Bot, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIMentorCard() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // UI Only
    toast.success(`AI Response simulated for: "${query}"`);
    setQuery('');
  };

  return (
    <div className="p-5 bg-indigo-50/50 dark:bg-indigo-950/15 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl shadow-sm text-left transition-colors theme-transition space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-500 text-white rounded-xl">
          <Bot className="h-4.5 w-4.5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight">
            Ask CareerForge AI
          </h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
            Your AI career mentor is here to help!
          </p>
        </div>
      </div>

      {/* Input query form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What should I improve for Amazon SDE role?"
          className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-colors shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors cursor-pointer"
          aria-label="Submit Question"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
