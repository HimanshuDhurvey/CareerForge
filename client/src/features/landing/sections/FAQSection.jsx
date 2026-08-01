import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { faqData } from '../data/landingData';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-[#0b0f19] border-b border-[#E5E7EB] dark:border-gray-800 transition-colors theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#111111] dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#6B7280] dark:text-gray-400">
            Have questions? We have answers. If you need further help, feel free to reach out.
          </p>
        </div>

        {/* Accordion List */}
        <div className="border-t border-[#111111] dark:border-white">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-b border-[#E5E7EB] dark:border-gray-800">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-6 flex justify-between items-center text-left text-[#111111] dark:text-white font-bold text-base sm:text-lg focus:outline-none cursor-pointer group"
                >
                  <span className="group-hover:text-[#60A5FA] dark:group-hover:text-[#60A5FA] transition-colors">
                    {faq.question}
                  </span>
                  <span className="ml-6 shrink-0 p-1.5 border border-[#E5E7EB] dark:border-gray-800 group-hover:border-[#111111] dark:group-hover:border-white transition-colors bg-white dark:bg-black rounded-lg">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-black dark:text-white" />
                    ) : (
                      <Plus className="h-4 w-4 text-black dark:text-white" />
                    )}
                  </span>
                </button>
                
                {/* Accordion panel content */}
                {isOpen && (
                  <div className="pb-8 text-sm sm:text-base text-[#6B7280] dark:text-gray-400 leading-relaxed max-w-3xl">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
