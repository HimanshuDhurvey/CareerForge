import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.jpg';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleScrollTo = (id) => {
    console.log('handleScrollTo called with id:', id);
    setIsOpen(false);
    const element = document.getElementById(id);
    console.log('Found element:', element);
    if (element) {
      const yOffset = -80; // Compensate for sticky navbar height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      console.log('Scrolling to y position:', y);
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      console.warn('Element not found for scroll target id:', id);
    }
  };

  return (
    <nav className="border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f19] sticky top-0 z-50 transition-colors theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and Platform Name */}
          <div 
            className="flex items-center gap-2 cursor-pointer font-extrabold text-xl tracking-tight text-[#111111] dark:text-white" 
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="CareerForge Logo" className="h-9 w-9 rounded-md object-cover" />
            <span>Career<span className="text-blue-600 dark:text-blue-500">Forge</span></span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollTo('features')}
              className="text-sm font-semibold text-[#6B7280] hover:text-[#111111] dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="text-sm font-semibold text-[#6B7280] hover:text-[#111111] dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollTo('faq')}
              className="text-sm font-semibold text-[#6B7280] hover:text-[#111111] dark:text-gray-400 dark:hover:text-white cursor-pointer transition-colors"
            >
              FAQ
            </button>
          </div>

          {/* Desktop CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 border border-[#E5E7EB] dark:border-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white transition-all cursor-pointer rounded-full hover:bg-gray-50 dark:hover:bg-gray-900"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            </button>

            <Link
              to="/login"
              className="text-sm font-semibold text-[#6B7280] hover:text-[#111111] dark:text-gray-400 dark:hover:text-white transition-colors px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-6 py-2.5 transition-all rounded-full shadow-sm hover:shadow"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Actions (Burger & Theme toggle) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 border border-[#E5E7EB] dark:border-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white transition-all cursor-pointer rounded-full"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f19] transition-all">
          <div className="px-4 pt-2 pb-6 space-y-1.5 flex flex-col">
            <button
              onClick={() => handleScrollTo('features')}
              className="text-left w-full px-3 py-2.5 text-base font-semibold text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-gray-900 rounded-full"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo('how-it-works')}
              className="text-left w-full px-3 py-2.5 text-base font-semibold text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-gray-900 rounded-full"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollTo('faq')}
              className="text-left w-full px-3 py-2.5 text-base font-semibold text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-gray-900 rounded-full"
            >
              FAQ
            </button>
            <div className="border-t border-[#E5E7EB] dark:border-gray-800 my-2"></div>
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="px-3 py-2.5 text-base font-semibold text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white hover:bg-[#F8F9FA] dark:hover:bg-gray-900 rounded-full"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="mx-3 mt-2 text-center text-sm font-bold bg-[#111111] dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-100 px-5 py-3 transition-all rounded-full block shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
