import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Video, Sparkles, Trophy, CheckCircle } from 'lucide-react';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import ContinueInterviewCard from '../components/ContinueInterviewCard';
import InterviewTypeCard from '../components/InterviewTypeCard';
import RecentInterviewCard from '../components/RecentInterviewCard';
import QuickTipsCard from '../components/QuickTipsCard';

export default function InterviewHome() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Mock Data
  const mockContinueInterview = {
    company: "Google",
    role: "Frontend Engineer",
    progress: 60, // 3 of 5 questions answered
    lastUpdated: "2 hours ago"
  };

  const mockInterviewTypes = [
    {
      id: "technical",
      title: "Technical Interview",
      description: "Data Structures, Algorithms, Coding challenges, and problem solving questions.",
      iconName: "Code2"
    },
    {
      id: "behavioral",
      title: "Behavioral Interview",
      description: "STAR method questions, situational analysis, culture fit, and teamwork scenarios.",
      iconName: "Users"
    },
    {
      id: "hr",
      title: "HR Interview",
      description: "Background verification, career aspirations, salary expectations, and soft skills.",
      iconName: "Briefcase"
    },
    {
      id: "system-design",
      title: "System Design",
      description: "Scalability, architecture, database choices, load balancers, and system flow.",
      iconName: "Cpu"
    },
    {
      id: "mixed",
      title: "Mixed Mode",
      description: "A customized combination of Technical, Behavioral, and HR questions in one session.",
      iconName: "Sparkles"
    }
  ];

  const mockRecentInterviews = [
    {
      id: 1,
      company: "Meta",
      role: "Product Engineer",
      type: "Technical",
      score: 85,
      date: "July 28, 2026"
    },
    {
      id: 2,
      company: "Amazon",
      role: "Software Development Engineer",
      type: "Behavioral",
      score: 72,
      date: "July 24, 2026"
    },
    {
      id: 3,
      company: "Netflix",
      role: "Senior UI Engineer",
      type: "Mixed",
      score: 91,
      date: "July 15, 2026"
    }
  ];

  const mockQuickTips = [
    "Practice regularly to reduce anxiety and build natural muscle memory.",
    "Answer confidently and construct your replies using the STAR method.",
    "Think before speaking: take a 5-second pause to structure your thoughts.",
    "Keep your explanations concise and focus on the impact of your actions."
  ];

  // Handlers
  const handleStartNewInterview = () => {
    navigate('/ai-interviews/setup');
  };

  const handleContinueInterview = () => {
    toast.success("Resuming your Google Frontend mock interview.");
  };

  const handleSelectInterviewType = (typeId) => {
    toast.success(`Selected ${typeId.toUpperCase()} mock interview category.`);
  };

  const handleRecentClick = () => {
    navigate('/ai-interviews/history');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

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
                Practice realistic interviews powered by AI.
              </p>
            </div>
            <button
              onClick={handleStartNewInterview}
              className="inline-flex items-center justify-center h-12 px-6 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            >
              Start New Interview
            </button>
          </div>

          {/* Grid Layout splits into primary content and right actions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Primary Center Content (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Continue Previous Interview Card */}
              <ContinueInterviewCard 
                interview={mockContinueInterview} 
                onContinue={handleContinueInterview} 
              />

              {/* Interview Types Section */}
              <div className="space-y-4">
                <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                  Interview Types
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockInterviewTypes.map((type) => (
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
                <div className="space-y-3">
                  {mockRecentInterviews.map((interview) => (
                    <RecentInterviewCard 
                      key={interview.id} 
                      interview={interview} 
                      onClick={() => handleRecentClick(interview.company)} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Sidebar Content (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Quick Tips Card */}
              <QuickTipsCard tips={mockQuickTips} />

              {/* Mock Analytics summary promo card */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
                <div className="flex items-center gap-2 text-blue-400">
                  <Trophy className="h-4.5 w-4.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Your Progress</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="text-xl font-extrabold text-[#111111] dark:text-white">12</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Completed</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
                    <div className="text-xl font-extrabold text-emerald-500">82.6%</div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Avg Score</div>
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
