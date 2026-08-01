import React from 'react';
import { Video, Code2, Flame, Map, Clock, Circle } from 'lucide-react';

export default function ActivityCard({ progress, activities }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'video':
        return <Video className="h-4.5 w-4.5 text-indigo-500" />;
      case 'code':
        return <Code2 className="h-4.5 w-4.5 text-emerald-500" />;
      case 'flame':
        return <Flame className="h-4.5 w-4.5 text-amber-500" />;
      case 'map':
      default:
        return <Map className="h-4.5 w-4.5 text-blue-500" />;
    }
  };

  const getIconBg = (iconName) => {
    switch (iconName) {
      case 'video':
        return 'bg-indigo-50 dark:bg-indigo-950/20';
      case 'code':
        return 'bg-emerald-50 dark:bg-emerald-950/20';
      case 'flame':
        return 'bg-amber-50 dark:bg-amber-950/20';
      case 'map':
      default:
        return 'bg-blue-50 dark:bg-blue-950/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Summary section */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
          Progress Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {progress.map((item, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3.5 p-3.5 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl"
            >
              <div className={`p-2.5 rounded-xl ${getIconBg(item.icon)}`}>
                {getIcon(item.icon)}
              </div>
              <div className="text-left space-y-0.5">
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
                  {item.title}
                </span>
                <span className="text-sm font-extrabold text-gray-800 dark:text-gray-100 block">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Timeline section */}
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-5">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
          Activity Timeline
        </h3>

        <div className="relative border-l border-gray-100 dark:border-gray-800 pl-4 ml-2.5 space-y-6">
          {activities.map((activity, idx) => (
            <div key={idx} className="relative space-y-1">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[21.5px] top-1 bg-white dark:bg-[#111827] p-0.5 rounded-full z-10 text-blue-500">
                <Circle className="h-3 w-3 fill-current stroke-[3]" />
              </div>

              {/* Event details */}
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">
                {activity.text}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 font-bold">
                <Clock className="h-3 w-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
