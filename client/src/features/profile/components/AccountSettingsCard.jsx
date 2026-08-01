import React, { useState, useEffect } from 'react';
import { Bell, Moon, Sun, Globe, Trash2, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../auth/services/authService';
import toast from 'react-hot-toast';

export default function AccountSettingsCard() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [lang, setLang] = useState('English');

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
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLanguageChange = (e) => {
    setLang(e.target.value);
    toast.success(`Language changed to ${e.target.value}`);
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested. Please contact support.");
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Successfully logged out.");
    navigate('/login');
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
        Account Settings
      </h3>

      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        
        {/* Toggle Email Notifications */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Email Notifications
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                Daily goals and updates
              </p>
            </div>
          </div>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`
              w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none
              ${notifications ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
            `}
            aria-label="Toggle notifications status"
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Toggle Dark Mode */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg shrink-0">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Dark Mode Theme
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                Toggle display theme
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`
              w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none
              ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
            `}
            aria-label="Toggle theme status"
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Language Selection */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg shrink-0">
              <Globe className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Preferred Language
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                Interface translation
              </p>
            </div>
          </div>
          <select 
            value={lang}
            onChange={handleLanguageChange}
            className="text-xs font-bold bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-lg px-2.5 py-1 text-gray-700 dark:text-gray-300 focus:outline-none"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
          </select>
        </div>

        {/* Delete Account */}
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-lg shrink-0">
              <Trash2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-red-500">
                Delete Account
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                Permanently erase data
              </p>
            </div>
          </div>
          <button 
            onClick={handleDeleteAccount}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Request delete account"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Logout */}
        <div className="py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-lg shrink-0">
              <LogOut className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                Logout Session
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">
                Sign out of client
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 font-bold rounded-lg text-[10px] transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
