import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell } from 'lucide-react';
import ProfileDropdown from '../../../components/Navbar/ProfileDropdown';
import { useAuth } from '../../../context/AuthContext';

export default function TopNavbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useAuth();
  const displayInitials = user ? (user.fullName || user.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'H';

  // Map route paths to dynamic Page Titles
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/profile':
        return 'Profile';
      case '/ai-interviews':
        return 'AI Interviews';
      case '/coding-practice':
        return 'Coding Practice';
      case '/resume-analyzer':
        return 'Resume Analyzer';
      case '/career-roadmap':
      case '/career roadmap':
      case '/career%20roadmap':
      case '/career_roadmap':
      case '/roadmap':
        return 'Career Roadmap';
      case '/ai-mentor':
        return 'AI Mentor';
      case '/progress':
        return 'Progress';
      case '/saved-resources':
        return 'Saved Resources';
      case '/achievements':
        return 'Achievements';
      case '/settings':
        return 'Settings';
      case '/help-support':
        return 'Help & Support';
      case '/notifications':
        return 'Notifications';
      default:
        const cleanStr = pathname.replace('/', '').replace('-', ' ');
        return cleanStr ? cleanStr.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Dashboard';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="h-[72px] flex-shrink-0 border-b border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f19] px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 w-full transition-colors duration-200">
      {/* Left: Page Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 lg:hidden cursor-pointer transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#111111] dark:text-white">
          {pageTitle}
        </h1>
      </div>

      {/* Center: Compact Search Bar */}
      <div className="hidden md:flex flex-1 justify-center max-w-[450px] mx-4">
        <div className="relative w-full max-w-[450px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search interviews, companies, skills..."
            className="w-full h-11 pl-11 pr-12 bg-[#F8F9FA] dark:bg-[#111827]/60 border border-[#E5E7EB] dark:border-gray-800 rounded-[12px] text-sm text-[#111111] dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all shadow-xs"
          />
          <kbd className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-white dark:bg-[#1f2937] border border-[#E5E7EB] dark:border-gray-700 px-1.5 py-0.5 rounded text-[9px] font-sans font-medium text-gray-400 shadow-sm select-none">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">

        {/* Notification Icon */}
        <button 
          onClick={() => navigate('/notifications')}
          className="p-2.5 border border-[#E5E7EB] dark:border-gray-800 text-[#6B7280] dark:text-gray-400 hover:text-[#111111] dark:hover:text-white rounded-[12px] hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors relative cursor-pointer"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-blue-500 rounded-full border border-white dark:border-[#0b0f19]" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 hidden sm:block" />

        {/* User Avatar */}
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-extrabold flex items-center justify-center text-sm cursor-pointer shadow-sm ring-2 ring-gray-100 dark:ring-gray-800 hover:ring-blue-100 dark:hover:ring-blue-950/40 transition-all duration-200 focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User Profile Options Menu"
          >
            {displayInitials}
          </button>
          
          <ProfileDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </div>
    </header>
  );
}
