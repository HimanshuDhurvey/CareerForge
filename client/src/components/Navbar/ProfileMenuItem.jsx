import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfileMenuItem({ to, icon: Icon, title, onClick, index }) {
  const navigate = useNavigate();

  const handlePress = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <button
      role="menuitem"
      id={`profile-menu-item-${index}`}
      onClick={handlePress}
      className="w-full h-12 px-4 flex items-center justify-between text-left bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/20 text-[#374151] dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all duration-150 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-950/20 focus:text-blue-500 dark:focus:text-blue-400 focus:outline-none group select-none"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-4.5 w-4.5 text-gray-400 group-hover:text-blue-500 group-focus:text-blue-500 transition-colors duration-150 shrink-0" />
        <span className="text-xs font-bold tracking-tight">
          {title}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-focus:text-blue-500 transition-colors duration-150" />
    </button>
  );
}
