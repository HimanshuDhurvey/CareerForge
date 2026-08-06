import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import WelcomeCard from '../components/WelcomeCard';
import StatsCards from '../components/StatsCards';
import DailyGoal from '../components/DailyGoal';
import ContinueLearning from '../components/ContinueLearning';
import RecentInterviews from '../components/RecentInterviews';
import SkillOverview from '../components/SkillOverview';
import AIRecommendations from '../components/AIRecommendations';
import RoadmapProgress from '../components/RoadmapProgress';
import AIMentorCard from '../components/AIMentorCard';
import { dashboardService } from '../../../services/dashboardService';
import { useAuth } from '../../../context/AuthContext';

// Default daily goals fallback object
const defaultDailyGoals = {
  date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
  estimatedTime: '45 mins',
  tasks: [
    { id: 1, text: 'Review AI Resume ATS warnings', completed: true },
    { id: 2, text: 'Complete a 15-min Technical Mock Interview', completed: false },
    { id: 3, text: 'Practice React Hooks & State Management', completed: false },
  ],
};

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError(err.message || 'Failed to load dashboard statistics.');
      toast.error(err.message || 'Failed to load dashboard data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Content Container */}
        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* LOADING SKELETON */}
          {isLoading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-28 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-32 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                  <div className="h-48 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-64 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                    <div className="h-64 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                  </div>
                </div>
                <div className="lg:col-span-4 space-y-6">
                  <div className="h-64 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                  <div className="h-64 bg-white dark:bg-[#111827] rounded-2xl border border-[#E5E7EB] dark:border-gray-800" />
                </div>
              </div>
            </div>
          )}

          {/* ERROR STATE */}
          {!isLoading && error && (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl text-center space-y-3">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <h3 className="text-sm font-extrabold text-red-700 dark:text-red-400">
                Failed to load Dashboard
              </h3>
              <p className="text-xs text-red-600 dark:text-red-300 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchDashboard}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* DASHBOARD CONTENT */}
          {!isLoading && !error && dashboardData && (
            <>
              {/* Profile Card Summary & Career Readiness */}
              <WelcomeCard
                profileSummary={dashboardData.profileSummary}
                careerReadinessScore={dashboardData.careerReadinessScore}
              />

              {/* Quick Statistics Cards */}
              <StatsCards
                resumeCard={dashboardData.resumeCard}
                interviewCard={dashboardData.interviewCard}
                careerReadinessScore={dashboardData.careerReadinessScore}
              />

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Center Content (8 cols) */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Resume Card & Interview Card Hub */}
                  <ContinueLearning
                    resumeCard={dashboardData.resumeCard}
                    interviewCard={dashboardData.interviewCard}
                  />

                  {/* Recent Activity Timeline & Top AI Recommendations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <RecentInterviews
                      recentActivities={dashboardData.recentActivities}
                      recentReports={dashboardData.recentReports}
                    />
                    <AIRecommendations
                      recommendations={dashboardData.recommendations}
                    />
                  </div>

                  {/* AI Career Roadmap & Evaluation Reports */}
                  <RoadmapProgress
                    recentReports={dashboardData.recentReports}
                    roadmapProgress={dashboardData.roadmapProgress}
                  />
                </div>

                {/* Right Side Bar (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <DailyGoal dailyGoals={defaultDailyGoals} />
                  <SkillOverview skillAnalysis={dashboardData.skillAnalysis} />
                  <AIMentorCard />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
