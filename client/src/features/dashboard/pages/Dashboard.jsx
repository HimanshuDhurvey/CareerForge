import React, { useState } from 'react';
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
import { dashboardData } from '../data/dashboardData';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] flex transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar onMenuToggle={toggleSidebar} />

        {/* Scrollable Content Container */}
        <main className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Welcome Card & Stats Grid */}
          <WelcomeCard userName={dashboardData.user.name} />
          
          <StatsCards stats={dashboardData.stats} />

          {/* Grid Layout splits into primary content and right actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Primary Center Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <ContinueLearning continueLearning={dashboardData.continueLearning} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <RecentInterviews recentInterviews={dashboardData.recentInterviews} />
                <AIRecommendations aiRecommendations={dashboardData.aiRecommendations} />
              </div>

              <RoadmapProgress roadmap={dashboardData.roadmap} />
            </div>

            {/* Right Side Sidebar Content (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <DailyGoal dailyGoals={dashboardData.dailyGoals} />
              <SkillOverview skills={dashboardData.skills} />
              <AIMentorCard />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
