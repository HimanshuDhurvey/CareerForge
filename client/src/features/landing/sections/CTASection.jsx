import React from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0b0f19] text-black dark:text-white text-center transition-colors theme-transition">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white leading-tight">
          Start Your Interview Preparation Today
        </h2>
        <p className="text-base sm:text-lg text-[#6B7280] dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
          Join thousands of candidates using CareerForge to build confidence, perfect their resumes, and secure top offers.
        </p>
        <div className="pt-6">
          <Link
            to="/register"
            className="inline-block bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-8 py-3.5 text-base font-semibold transition-all rounded-xl shadow-sm hover:shadow"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
