import React from 'react';
import { Globe, Award, ExternalLink } from 'lucide-react';

const Github = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function SocialLinksCard({ socials }) {
  const getSocialIcon = (key) => {
    switch (key.toLowerCase()) {
      case 'github':
        return <Github className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'portfolio':
        return <Globe className="h-4 w-4" />;
      case 'leetcode':
      case 'codechef':
      default:
        return <Award className="h-4 w-4" />;
    }
  };

  const formattedName = (key) => {
    if (key === 'leetcode') return 'LeetCode';
    if (key === 'codechef') return 'CodeChef';
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
        Social Profiles
      </h3>

      <div className="space-y-2.5">
        {Object.entries(socials).map(([key, url], idx) => (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 border border-[#E5E7EB] dark:border-gray-800/80 bg-gray-50/20 dark:bg-[#111827]/30 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 border border-[#E5E7EB] dark:border-gray-700/60 rounded-lg text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors shrink-0">
                {getSocialIcon(key)}
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {formattedName(key)}
              </span>
            </div>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          </a>
        ))}
      </div>
    </div>
  );
}
