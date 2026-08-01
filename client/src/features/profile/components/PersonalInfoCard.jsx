import React from 'react';
import { User, Mail, Phone, Calendar, School, ShieldAlert, Award, FileClock } from 'lucide-react';

export default function PersonalInfoCard({ personal }) {
  const fields = [
    { label: "Full Name", value: personal.name, icon: User },
    { label: "Email Address", value: personal.email, icon: Mail },
    { label: "Phone Number", value: personal.phone || "Not Provided", icon: Phone },
    { label: "Date of Birth", value: personal.dob || "Not Provided", icon: Calendar },
    { label: "College / University", value: personal.college, icon: School },
    { label: "Current Degree", value: personal.degree, icon: Award },
    { label: "Academic Branch", value: personal.branch, icon: ShieldAlert },
    { label: "Graduation Year", value: personal.gradYear, icon: FileClock },
  ];

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, idx) => {
          const Icon = field.icon;
          return (
            <div 
              key={idx} 
              className="p-3.5 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-1.5 transition-colors flex items-start gap-3"
            >
              <div className="p-2 bg-white dark:bg-gray-800 text-blue-500 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700/50 shrink-0">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-left space-y-0.5 min-w-0">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
                  {field.label}
                </span>
                <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block truncate">
                  {field.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
