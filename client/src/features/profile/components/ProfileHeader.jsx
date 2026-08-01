import React from 'react';
import { Mail, GraduationCap, MapPin, Edit2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileHeader({ personal, onEditClick }) {
  const handleChangeAvatar = () => {
    toast.success("Avatar upload panel is simulated (UI only).");
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm text-left transition-colors theme-transition">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Section: Avatar & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
          {/* Avatar container */}
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-500 text-white font-extrabold flex items-center justify-center text-3xl shadow-md border-4 border-gray-50 dark:border-gray-800">
              {personal.name.charAt(0)}
            </div>
            <button
              onClick={handleChangeAvatar}
              className="absolute bottom-0 right-0 p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full border-2 border-white dark:border-gray-900 transition-colors shadow cursor-pointer"
              aria-label="Change Avatar"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                {personal.name}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-500 uppercase tracking-wide">
                {personal.badge}
              </span>
            </div>

            {/* Sub details */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 font-semibold">
              <div className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                <span>{personal.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5 text-gray-400" />
                <span>{personal.degree} • Semester {personal.currentSemester}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                <span>{personal.location}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
              {personal.college}
            </p>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 self-center">
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
