import React from 'react';
import { stepsData } from '../data/landingData';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#F8F9FA] dark:bg-[#0b0f19] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            How CareerForge works.
          </h2>
          <p className="text-lg text-[#6B7280] dark:text-gray-400">
            A simple three-step process designed to elevate your interview capabilities efficiently.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8 relative">
          {stepsData.map((step, index) => (
            <div key={index} className="space-y-4 text-left relative flex flex-col justify-between">
              <div>
                <span className="text-5xl font-extrabold text-[#60A5FA] dark:text-[#60A5FA]/80 block tracking-tight select-none">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-[#111111] dark:text-white mt-4">{step.title}</h3>
                <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed mt-2">
                  {step.description}
                </p>
              </div>
              
              {/* Divider connector for desktop layout */}
              {index < stepsData.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-6 w-1/4 border-t border-dashed border-[#E5E7EB] dark:border-gray-800 translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
