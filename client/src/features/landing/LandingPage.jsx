import React from 'react';
import Navbar from '../../components/layout/Navbar';
import HeroSection from './sections/HeroSection';
import HowItWorksSection from './sections/HowItWorksSection';
import FAQSection from './sections/FAQSection';
import CTASection from './sections/CTASection';
import Footer from '../../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19] flex flex-col transition-colors theme-transition">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
