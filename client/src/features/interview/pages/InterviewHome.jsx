import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Video, Trophy, Loader2 } from 'lucide-react';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import ContinueInterviewCard from '../components/ContinueInterviewCard';
import InterviewTypeCard from '../components/InterviewTypeCard';
import RecentInterviewCard from '../components/RecentInterviewCard';
import QuickTipsCard from '../components/QuickTipsCard';
import { interviewService } from '../../../services/interviewService';
import { useInterview } from '../../../context/InterviewContext';
import { INTERVIEW_TYPES, QUICK_TIPS } from '../data/interviewTypes';

export default function InterviewHome() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setCurrentInterviewId } = useInterview();

  const [loading, setLoading] = useState(true);
  const [userInterviews, setUserInterviews] = useState([]);

  useEffect(() => {
    const fetchHomeInterviews = async () => {
      setLoading(true);
      try {
        const data = await interviewService.getUserInterviews({ page: 1, limit: 10 });
        setUserInterviews(data.interviews || []);
      } catch (err) {
        console.warn('Failed to load user interviews for home:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeInterviews();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleStartNewInterview = () => {
    navigate('/ai-interviews/setup');
  };

  // Check if there is an in-progress interview session
  const activeInterview = userInterviews.find((i) => i.status === 'in_progress');

  const handleContinueInterview = () => {
    if (activeInterview) {
      setCurrentInterviewId(activeInterview.id);
      navigate(`/ai-interviews/session/${activeInterview.id}`);
    } else {
      navigate('/ai-interviews/setup');
    }
  };

  const handleSelectInterviewType = (typeId) => {
    navigate('/ai-interviews/setup');
  };

  const handleRecentClick = (interviewId) => {
    if (interviewId) {
      navigate(`/ai-interviews/details/${interviewId}`);
    } else {
      navigate('/ai-interviews/history');
    }
  };

  // Convert backend interviews to card formats
  const recentInterviewsFormatted = userInterviews.slice(0, 3).map((i) => ({
    id: i.id,
    company: i.title?.split('-')[0]?.trim() || 'Target Company',
    role: i.role || i.title,
    type: i.interviewType,
    difficulty: i.difficulty,
    date: i.createdAt ? new Date(i.createdAt).toLocaleDateString() : 'Recent',
    score: i.score || 0,
    status: i.status,
  }));

  const activeInterviewFormatted = activeInterview
    ? {
        id: activeInterview.id,
        title: activeInterview.title,
        company: activeInterview.title?.split('-')[0]?.trim() || 'Active Session',
        role: activeInterview.role,
        completedCount: activeInterview.currentQuestionIndex || 0,
        totalQuestions: activeInterview.totalQuestions || 10,
        lastActive: 'Just now',
      }
    : null;

  const completedCount = userInterviews.filter((i) => i.status === 'completed').length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Content Container */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Header Banner */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-[#60A5FA]">
                <Video className="h-6 w-6" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Modules</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                AI Mock Interviews
              </h1>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                Practice realistic interviews powered by CareerForge AI Engine.
              </p>
            </div>
            <button
              onClick={handleStartNewInterview}
              className="inline-flex items-center justify-center h-12 px-6 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Start New Interview
            </button>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Primary Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Continue Previous Interview Card (if active session exists) */}
              {activeInterviewFormatted && (
                <ContinueInterviewCard
                  interview={activeInterviewFormatted}
                  onContinue={handleContinueInterview}
                />
              )}

              {/* Interview Types Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                  Interview Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {INTERVIEW_TYPES.map((type) => (
                    <InterviewTypeCard
                      key={type.id}
                      type={type}
                      onSelect={handleSelectInterviewType}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Interviews Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                    Recent Interviews
                  </h2>
                  <button
                    onClick={() => navigate('/ai-interviews/history')}
                    className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    View Full History
                  </button>
                </div>

                {loading ? (
                  <div className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-[#60A5FA]" />
                    Loading recent interview sessions...
                  </div>
                ) : recentInterviewsFormatted.length > 0 ? (
                  <div className="space-y-3">
                    {recentInterviewsFormatted.map((interview) => (
                      <RecentInterviewCard
                        key={interview.id}
                        interview={interview}
                        onClick={() => handleRecentClick(interview.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl text-center text-xs font-semibold text-gray-400">
                    No interview sessions found yet. Click "Start New Interview" to begin your first session!
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Sidebar (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Quick Tips Card */}
              <QuickTipsCard tips={QUICK_TIPS} />

              {/* Analytics summary card */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Trophy className="h-4.5 w-4.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Your Progress</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="text-xl font-extrabold text-[#111111] dark:text-white">
                      {completedCount}
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                      Completed
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="text-xl font-extrabold text-emerald-500">
                      {userInterviews.length}
                    </div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                      Total Sessions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
