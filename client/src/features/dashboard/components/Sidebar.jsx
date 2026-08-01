import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Video, Code2, FileText, Map, 
  Bot, BarChart3, Bookmark, Trophy, Settings, 
  HelpCircle, Sparkles, LogOut, X, User
} from 'lucide-react';
import { authService } from '../../auth/services/authService';
import logo from '../../../assets/logo.jpg';
import toast from 'react-hot-toast';
import SidebarItem from './SidebarItem';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'AI Interviews', icon: Video, path: '/ai-interviews' },
    { name: 'Coding Practice', icon: Code2, path: '/coding-practice' },
    { name: 'Resume Analyzer', icon: FileText, path: '/resume-analyzer' },
    { name: 'Career Roadmap', icon: Map, path: '/career-roadmap' },
    { name: 'AI Mentor', icon: Bot, path: '/ai-mentor' },
    { name: 'Progress', icon: BarChart3, path: '/progress' },
    { name: 'Saved Resources', icon: Bookmark, path: '/saved-resources' },
    { name: 'Achievements', icon: Trophy, path: '/achievements' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Help & Support', icon: HelpCircle, path: '/help-support' },
  ];

  const handleLogout = () => {
    authService.logout();
    toast.success("Successfully logged out.");
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 border-r border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#0b0f19] flex flex-col justify-between p-4 transition-transform lg:translate-x-0 lg:static lg:h-screen lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div 
            className="flex items-center gap-2 font-extrabold text-xl tracking-tight text-[#111111] dark:text-white cursor-pointer"
            onClick={() => { navigate('/dashboard'); onClose(); }}
          >
            <img src={logo} alt="CareerForge Logo" className="h-8 w-8 rounded-md object-cover" />
            <span>
              Career<span className="text-blue-500">Forge</span>
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 lg:hidden cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {menuItems.map((item, idx) => (
            <SidebarItem
              key={idx}
              to={item.path}
              icon={item.icon}
              onClick={onClose}
            >
              {item.name}
            </SidebarItem>
          ))}

          {/* Premium Promotion Card */}
          <div className="mt-6 border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl text-left space-y-2.5">
            <div className="flex items-center gap-2 text-blue-500">
              <Sparkles className="h-4.5 w-4.5" />
              <span className="text-xs font-bold uppercase tracking-wider">Unlock Premium</span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-gray-400 font-medium leading-relaxed">
              Get unlimited mock interviews, AI suggestions and more.
            </p>
            <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm">
              Upgrade Now
            </button>
          </div>
        </nav>

        {/* Bottom Profile and Logout Section */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-gray-800 space-y-2.5">

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer text-left"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
