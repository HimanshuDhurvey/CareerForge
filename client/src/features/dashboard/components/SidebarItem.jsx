import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarItem({ to, icon: Icon, children, onClick }) {
  // If no routing path is provided, fallback to a simple button styling
  if (!to) {
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-normal text-[#6B7280] dark:text-gray-400 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-[#111111] dark:hover:text-white rounded-xl transition-all duration-150 cursor-pointer text-left group"
      >
        <Icon className="h-4.5 w-4.5 text-gray-400 group-hover:text-blue-500 transition-colors duration-150" />
        <span>{children}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        relative w-full flex items-center gap-3 pl-4 pr-3 py-2 text-sm rounded-xl transition-all duration-150 cursor-pointer text-left group
        ${isActive 
          ? 'bg-[#EFF6FF] dark:bg-blue-950/30 text-blue-500 font-semibold' 
          : 'bg-transparent text-[#6B7280] dark:text-gray-400 font-normal hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-[#111111] dark:hover:text-white'}
      `}
    >
      {({ isActive }) => (
        <>
          {/* Active Left Indicator Bar (4px width) */}
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-md" />
          )}

          <Icon className={`
            h-4.5 w-4.5 transition-colors duration-150
            ${isActive 
              ? 'text-blue-500' 
              : 'text-gray-400 group-hover:text-blue-500'}
          `} />
          <span>{children}</span>
        </>
      )}
    </NavLink>
  );
}
