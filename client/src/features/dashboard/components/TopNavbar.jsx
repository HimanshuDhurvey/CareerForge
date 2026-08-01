import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Moon, Sun, ChevronDown } from 'lucide-react';
import logo from '../../../assets/logo.jpg';
import ProfileDropdown from '../../../components/Navbar/ProfileDropdown';

export default function TopNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

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

  return (
    <header className="h-16 border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f19] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors theme-transition">
      {/* Left Area: Hamburger and Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 font-extrabold text-lg tracking-tight text-[#111111] dark:text-white lg:hidden">
          <img src={logo} alt="CareerForge Logo" className="h-8 w-8 rounded-md object-cover" />
          <span className="hidden sm:inline">
            Career<span className="text-blue-500">Forge</span>
          </span>
        </div>
      </div>

      {/* Center Area: Search Bar */}
      <div className="flex-1 max-w-lg mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything... (e.g. React, DBMS, Amazon)"
            className="w-full pl-9 pr-12 py-1.5 bg-gray-50 dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-xs text-[#111111] dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1f2937] border border-[#E5E7EB] dark:border-gray-700 px-1.5 py-0.5 rounded text-[9px] font-sans font-medium text-gray-400 shadow-sm select-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 border border-[#E5E7EB] dark:border-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
          aria-label="Toggle theme mode"
        >
          {theme === 'light' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
        </button>

        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2 border border-[#E5E7EB] dark:border-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white dark:border-[#0b0f19] flex items-center justify-center text-[7px] text-white font-bold">
            3
          </span>
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-800" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 cursor-pointer group focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User Profile Options Menu"
          >
            <div className="w-8.5 h-8.5 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-sm ring-2 ring-gray-100 dark:ring-gray-800">
              H
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-[#111111] dark:text-white leading-tight">Himanshu</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Student</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#111111] dark:group-hover:text-white transition-colors" />
          </button>
          
          <ProfileDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
}
