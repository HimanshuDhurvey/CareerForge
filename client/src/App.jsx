import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, PublicRoute } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './features/landing/LandingPage';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Dashboard from './features/dashboard/pages/Dashboard';
import Profile from './features/profile/pages/Profile';
import Sidebar from './features/dashboard/components/Sidebar';
import TopNavbar from './features/dashboard/components/TopNavbar';
import InterviewHome from './features/interview/pages/InterviewHome';
import InterviewSetup from './features/interview/pages/InterviewSetup';
import InterviewInstructions from './features/interview/pages/InterviewInstructions';
import InterviewSession from './features/interview/pages/InterviewSession';
import InterviewFeedback from './features/interview/pages/InterviewFeedback';
import InterviewHistory from './features/interview/pages/InterviewHistory';
import ResumePage from './features/resume/pages/ResumePage';

// Minimal placeholder page to simulate navigation routes from CTAs
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center items-center p-6 text-center transition-colors">
      <div className="max-w-md w-full border border-black dark:border-white p-8 space-y-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] bg-white dark:bg-black transition-all">
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          This is a simulated page for the AI Interview Preparation Platform. The frontend landing page has been completed successfully.
        </p>
        <Link
          to="/"
          className="inline-block bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-6 py-2.5 text-sm font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

// Premium dashboard placeholder page wrapping Sidebar and TopNavbar layouts
function DashboardPlaceholderPage({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full flex items-center justify-center">
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-8 max-w-md w-full shadow-sm text-center">
            <h2 className="text-sm font-extrabold text-[#111111] dark:text-white mb-2 uppercase tracking-wide">{title}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              This module is simulated in the frontend. Full AI features and analytics integrations will be implemented in the upcoming sessions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white dark:border dark:border-gray-700',
            duration: 3000,
          }} 
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          
          {/* Dynamic Sidebar navigation active paths */}
          <Route path="/ai-interviews" element={<ProtectedRoute><InterviewHome /></ProtectedRoute>} />
          <Route path="/ai-interviews/setup" element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>} />
          <Route path="/ai-interviews/instructions" element={<ProtectedRoute><InterviewInstructions /></ProtectedRoute>} />
          <Route path="/ai-interviews/session" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
          <Route path="/ai-interviews/feedback" element={<ProtectedRoute><InterviewFeedback /></ProtectedRoute>} />
          <Route path="/ai-interviews/history" element={<ProtectedRoute><InterviewHistory /></ProtectedRoute>} />
          <Route path="/coding-practice" element={<ProtectedRoute><DashboardPlaceholderPage title="Coding Practice Room" /></ProtectedRoute>} />
          <Route path="/resume-analyzer" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
          <Route path="/resume" element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
          <Route path="/career-roadmap" element={<ProtectedRoute><DashboardPlaceholderPage title="AI Career Roadmap" /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><DashboardPlaceholderPage title="AI Career Roadmap" /></ProtectedRoute>} />
          <Route path="/ai-mentor" element={<ProtectedRoute><DashboardPlaceholderPage title="AI Career Mentor Coach" /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><DashboardPlaceholderPage title="Detailed Insights & Progress" /></ProtectedRoute>} />
          <Route path="/saved-resources" element={<ProtectedRoute><DashboardPlaceholderPage title="Saved Resources & Notes" /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><DashboardPlaceholderPage title="Achievements & Badges" /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><DashboardPlaceholderPage title="Platform Settings" /></ProtectedRoute>} />
          <Route path="/help-support" element={<ProtectedRoute><DashboardPlaceholderPage title="Help & Support Desk" /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><DashboardPlaceholderPage title="Notifications Center" /></ProtectedRoute>} />

          {/* General landing footer routes */}
          <Route path="/about" element={<PlaceholderPage title="About CareerForge" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
          
          {/* Fallback route */}
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

