import React from 'react';
import { featuresData } from '../data/landingData';

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-white dark:bg-[#0b0f19] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Everything you need to master your interviews.
          </h2>
          <p className="text-lg text-[#6B7280] dark:text-gray-400">
            A comprehensive, AI-driven suite engineered to test your soft skills, technical abilities, and application materials.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="border border-[#E5E7EB] dark:border-gray-800/80 p-6 space-y-5 flex flex-col items-start text-left bg-[#F8F9FA] dark:bg-[#111827]/30 hover:bg-white dark:hover:bg-[#111827]/60 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 rounded-2xl transition-all duration-300 group"
              >
                <div className="p-3 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] rounded-xl text-[#6B7280] group-hover:text-[#60A5FA] group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-all">
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#111111] dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-[#6B7280] dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
