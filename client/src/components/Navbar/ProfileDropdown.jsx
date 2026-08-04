import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, Bell,
  HelpCircle, LogOut, Sun, Moon
} from 'lucide-react';
import ProfileMenuItem from './ProfileMenuItem';
import useOutsideClick from '../../hooks/useOutsideClick';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProfileDropdown({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);

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

  // Close dropdown on outside click
  useOutsideClick(dropdownRef, () => {
    if (isOpen) onClose();
  });

  const menuItems = [
    { title: 'Account Settings', icon: Settings,   to: '/settings'       },
    { title: 'Notifications',    icon: Bell,        to: '/notifications'  },
    { title: 'Help & Support',   icon: HelpCircle,  to: '/help-support'   },
  ];

  // Header btn (1) + menu items (3) + Appearance toggle (1) + Logout (1)
  const totalFocusableItems = 1 + menuItems.length + 1 + 1;

  // Key event listeners for accessibility
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % totalFocusableItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + totalFocusableItems) % totalFocusableItems);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, totalFocusableItems, onClose]);

  // Focus the item when focusedIndex changes
  useEffect(() => {
    if (focusedIndex === -1) return;
    
    let elementId = '';
    if (focusedIndex === 0) {
      elementId = 'profile-dropdown-view-profile-btn';
    } else if (focusedIndex > 0 && focusedIndex <= menuItems.length) {
      elementId = `profile-menu-item-${focusedIndex - 1}`;
    } else if (focusedIndex === menuItems.length + 1) {
      elementId = 'profile-dropdown-theme-btn';
    } else if (focusedIndex === totalFocusableItems - 1) {
      elementId = 'profile-dropdown-logout-btn';
    }

    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  }, [focusedIndex, menuItems.length, totalFocusableItems]);

  const handleLogout = async () => {
    navigate('/');
    await logout();
    toast.success("Successfully logged out.");
    onClose();
  };

  const handleItemClick = (to) => {
    onClose();
    navigate(to);
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      role="menu"
      aria-label="User Profile Dropdown Menu"
      className="absolute right-0 mt-3.5 w-full sm:w-[320px] bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-[14px] shadow-lg py-5 px-4 z-50 text-left transition-colors select-none"
    >
      {/* Header section */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-lg shadow-sm">
          {user ? (user.fullName || user.name || '').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'H'}
        </div>
        <div className="text-left space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-extrabold text-[#111111] dark:text-white leading-tight">
              {user ? (user.fullName || user.name) : 'Himanshu Dhurvey'}
            </h4>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-500 uppercase tracking-wide">
              {user ? (user.role || 'Student') : 'Student'}
            </span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-none">
            {user ? user.email : 'himanshu@gmail.com'}
          </p>
        </div>
      </div>

      {/* View Profile Action button */}
      <div className="py-4">
        <button
          id="profile-dropdown-view-profile-btn"
          onClick={() => handleItemClick('/profile')}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-[#111827]"
        >
          View Career Profile
        </button>
      </div>

      {/* Menu items */}
      <div className="space-y-0.5 pb-3">
        {menuItems.map((item, idx) => (
          <ProfileMenuItem
            key={idx}
            index={idx}
            to={item.to}
            icon={item.icon}
            title={item.title}
            onClick={() => handleItemClick(item.to)}
          />
        ))}

        {/* Appearance / Theme Toggle — treated as a menu row */}
        <button
          role="menuitem"
          id="profile-dropdown-theme-btn"
          onClick={toggleTheme}
          className="w-full h-12 px-4 flex items-center justify-between text-left bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all duration-150 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-950/20 focus:text-blue-500 dark:focus:text-blue-400 focus:outline-none group select-none"
        >
          <div className="flex items-center gap-3">
            {theme === 'light' ? (
              <Moon className="h-4.5 w-4.5 text-gray-400 group-hover:text-blue-500 group-focus:text-blue-500 transition-colors duration-150 shrink-0" />
            ) : (
              <Sun className="h-4.5 w-4.5 text-gray-400 group-hover:text-blue-500 group-focus:text-blue-500 transition-colors duration-150 shrink-0" />
            )}
            <span className="text-xs font-bold tracking-tight">
              Appearance
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1 rounded-lg">
            {theme === 'light' ? 'Light' : 'Dark'}
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />

      {/* Footer: Logout */}
      <div className="pt-2">
        <button
          id="profile-dropdown-logout-btn"
          onClick={handleLogout}
          className="w-full h-12 px-4 flex items-center gap-3 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-150 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20 focus:outline-none group"
        >
          <LogOut className="h-4.5 w-4.5 text-red-400 group-hover:text-red-500 group-focus:text-red-500 transition-colors duration-150 shrink-0" />
          <span className="text-xs font-bold tracking-tight">
            Logout
          </span>
        </button>
      </div>
    </div>
  );
}
