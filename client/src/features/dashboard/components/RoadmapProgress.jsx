import React from 'react';
import { Check } from 'lucide-react';

export default function RoadmapProgress({ roadmap }) {
  const getStepStyle = (status) => {
    switch (status) {
      case 'completed':
        return {
          dot: 'bg-emerald-500 text-white border-emerald-500',
          text: 'text-[#111111] dark:text-white',
          line: 'bg-emerald-500'
        };
      case 'current':
        return {
          dot: 'bg-blue-500 text-white border-blue-500 ring-4 ring-blue-500/20',
          text: 'text-blue-500 font-extrabold',
          line: 'bg-gray-200 dark:bg-gray-800'
        };
      case 'upcoming':
      default:
        return {
          dot: 'bg-white dark:bg-[#111827] text-gray-300 border-gray-200 dark:border-gray-800',
          text: 'text-gray-400 dark:text-gray-500',
          line: 'bg-gray-200 dark:bg-gray-800'
        };
    }
  };

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-sm text-left transition-colors theme-transition">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Horizontal Roadmap Steps */}
        <div className="flex-1 w-full space-y-4">
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
            Career Roadmap Progress
          </h3>
          
          <div className="relative flex justify-between items-center w-full px-2 pt-2 pb-6 overflow-x-auto min-w-[320px] select-none no-scrollbar">
            {/* Horizontal Line behind */}
            <div className="absolute top-[21px] left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-800 z-0" />
            
            {/* Steps */}
            {roadmap.steps.map((step, idx) => {
              const styles = getStepStyle(step.status);
              
              // We also draw colored progress lines between dots
              const isLast = idx === roadmap.steps.length - 1;
              const nextStep = !isLast ? roadmap.steps[idx + 1] : null;
              const lineStyle = nextStep && (step.status === 'completed' && nextStep.status === 'completed' 
                ? 'bg-emerald-500' 
                : (step.status === 'completed' && nextStep.status === 'current' 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                  : 'bg-gray-200 dark:bg-gray-800'));

              return (
                <div key={idx} className="flex flex-col items-center relative z-10 min-w-[70px]">
                  {/* Step Connector Line Segment (overlay on background line) */}
                  {!isLast && (
                    <div 
                      className={`absolute top-[13px] left-[55px] w-[calc(100%-30px)] h-0.5 ${lineStyle}`}
                      style={{ width: 'calc(100% - 20px)', left: '50%' }}
                    />
                  )}

                  {/* Dot */}
                  <div className={`
                    w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
                    ${styles.dot}
                  `}>
                    {step.status === 'completed' ? (
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step Label */}
                  <span className={`text-[10px] font-bold mt-2 text-center truncate w-full ${styles.text}`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Circular Progress Dial */}
        <div className="flex items-center gap-4 shrink-0 px-2 lg:border-l lg:border-gray-100 lg:dark:border-gray-800/80 lg:pl-8">
          <div className="relative w-18 h-18">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Outer Ring */}
              <circle
                className="text-gray-100 dark:text-gray-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />
              {/* Colored progress line */}
              <circle
                className="text-blue-500"
                strokeWidth="3.5"
                strokeDasharray={`${roadmap.overallProgress}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-extrabold text-[#111111] dark:text-white">
                {roadmap.overallProgress}%
              </span>
            </div>
          </div>
          
          <div className="text-left">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold block uppercase tracking-wide">
              Roadmap Progress
            </p>
            <p className="text-xs font-extrabold text-[#111111] dark:text-white">
              72% Completed
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
