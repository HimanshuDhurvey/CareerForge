import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock, Upload, Sparkles, Video, CheckCircle2, Award, FileText } from 'lucide-react';

export default function RecentInterviews({ recentActivities, recentReports }) {
  const navigate = useNavigate();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'resume_uploaded':
        return <Upload className="h-4 w-4 text-purple-500" />;
      case 'resume_analyzed':
        return <Sparkles className="h-4 w-4 text-purple-600" />;
      case 'interview_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'evaluation_generated':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'interview_started':
      default:
        return <Video className="h-4 w-4 text-blue-500" />;
    }
  };

  const activities = recentActivities || [];

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs text-left transition-colors theme-transition flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2 text-blue-500">
          <Clock className="h-4.5 w-4.5" />
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
            Recent Activity Timeline
          </h3>
        </div>
        <button
          onClick={() => navigate('/ai-interviews/history')}
          className="text-blue-500 hover:text-blue-600 text-xs font-extrabold cursor-pointer"
        >
          View All →
        </button>
      </div>

      {/* List of Recent Activities */}
      {activities.length === 0 ? (
        <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center space-y-2 my-auto">
          <Clock className="h-6 w-6 text-gray-300 mx-auto" />
          <p className="text-xs font-extrabold text-gray-600 dark:text-gray-400">
            No recent activity recorded.
          </p>
          <p className="text-[10px] text-gray-400">
            Upload a resume or start an interview to build your activity history.
          </p>
        </div>
      ) : (
        <div className="space-y-3 flex-1">
          {activities.map((act) => (
            <div
              key={act.id}
              onClick={() => {
                if (act.type.includes('resume')) navigate('/resume');
                else navigate('/ai-interviews/history');
              }}
              className="flex items-start justify-between p-3 border border-[#E5E7EB] dark:border-gray-800/80 bg-white dark:bg-[#111827] hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-800 shrink-0 mt-0.5">
                  {getActivityIcon(act.type)}
                </div>
                <div className="text-left min-w-0">
                  <p className="text-xs font-bold text-[#111111] dark:text-white leading-tight truncate">
                    {act.title}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-normal truncate mt-0.5">
                    {act.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="text-[9.5px] text-gray-400 dark:text-gray-500 font-semibold">
                  {act.timestamp ? new Date(act.timestamp).toLocaleDateString() : 'Recent'}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
