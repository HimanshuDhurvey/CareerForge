import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Download,
  RefreshCw,
  LayoutDashboard,
  Sparkles,
  Brain,
  MessageSquare,
  ShieldCheck,
  Lightbulb,
  Code2,
  Video,
  Trophy,
  Star,
} from 'lucide-react';

import Sidebar   from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import ScoreRing    from '../components/ScoreRing';
import ScoreBar     from '../components/ScoreBar';
import FeedbackList from '../components/FeedbackList';
import TopicTag     from '../components/TopicTag';
import { MOCK_FEEDBACK } from '../data/feedback';

// ─── Helper: grade label from score ──────────────────────────────────────────
function getGrade(score) {
  if (score >= 90) return { label: 'Excellent', cls: 'text-emerald-500' };
  if (score >= 80) return { label: 'Good',      cls: 'text-blue-500' };
  if (score >= 65) return { label: 'Average',   cls: 'text-amber-500' };
  return            { label: 'Needs Work',       cls: 'text-red-500' };
}

// ─── Sub-section card wrapper ─────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2.5">
        {Icon && (
          <div className="p-1.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-[#60A5FA]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <h2 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewFeedback() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Accept real feedback data from route state in future; use mock for now.
  const fb = location.state?.feedback ?? MOCK_FEEDBACK;
  const { session, scores, strengths, weaknesses, aiSuggestions, recommendedTopics } = fb;

  const overall = getGrade(scores.overall);

  const subScores = [
    { label: 'Technical',       score: scores.technical,      icon: Code2 },
    { label: 'Communication',   score: scores.communication,  icon: MessageSquare },
    { label: 'Confidence',      score: scores.confidence,     icon: ShieldCheck },
    { label: 'Problem Solving', score: scores.problemSolving, icon: Brain },
  ];

  const handleDownload = () => {
    toast.success('Report download will be available once the backend is connected.');
  };

  const handleRetry = () => {
    navigate('/ai-interviews/setup');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">

            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#60A5FA]">
                  <Video className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">AI Interview Feedback</span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  {session.company} — {session.role}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  <span>{session.date}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>{session.difficulty} Difficulty</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>{session.answeredQuestions}/{session.totalQuestions} Questions Answered</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#60A5FA]/50 bg-blue-50/50 dark:bg-blue-950/20 text-[#60A5FA] font-bold text-xs rounded-xl hover:bg-blue-100/60 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Interview
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>

            {/* ── Grid Layout ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

              {/* LEFT: Main content (8 cols) */}
              <div className="lg:col-span-8 space-y-6">

                {/* Overall Score Hero */}
                <SectionCard title="Overall Performance" icon={Trophy}>
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Ring + grade */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      {/* We render ring + text together using a relative wrapper */}
                      <div className="relative w-[120px] h-[120px]">
                        <svg width="120" height="120" className="-rotate-90 absolute inset-0">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor"
                            strokeWidth="10" className="text-gray-100 dark:text-gray-800" />
                          <circle cx="60" cy="60" r="50" fill="none"
                            stroke={scores.overall >= 85 ? '#10B981' : scores.overall >= 70 ? '#60A5FA' : scores.overall >= 55 ? '#F59E0B' : '#EF4444'}
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - scores.overall / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-[#111111] dark:text-white tabular-nums leading-none">
                            {scores.overall}
                            <span className="text-sm font-bold text-gray-400">%</span>
                          </span>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wide mt-1 ${overall.cls}`}>
                            {overall.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score sub-stats summary */}
                    <div className="flex-1 w-full space-y-3.5">
                      {subScores.map(({ label, score, icon }) => (
                        <ScoreBar key={label} label={label} score={score} icon={icon} />
                      ))}
                    </div>
                  </div>
                </SectionCard>

                {/* Strengths & Weaknesses side by side on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FeedbackList
                    title="Strengths"
                    items={strengths}
                    variant="strength"
                  />
                  <FeedbackList
                    title="Areas to Improve"
                    items={weaknesses}
                    variant="weakness"
                  />
                </div>

                {/* AI Suggestions */}
                <SectionCard title="AI Coach Suggestions" icon={Sparkles}>
                  <ul className="space-y-4">
                    {aiSuggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#60A5FA] flex items-center justify-center text-[10px] font-extrabold">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                          {suggestion}
                        </p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

              </div>

              {/* RIGHT: Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-5">

                {/* Score breakdown card */}
                <SectionCard title="Score Breakdown" icon={Star}>
                  <div className="grid grid-cols-2 gap-3">
                    {subScores.map(({ label, score }) => {
                      const grade = getGrade(score);
                      const bg =
                        score >= 85 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40'
                        : score >= 70 ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40'
                        : score >= 55 ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40'
                        : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40';

                      return (
                        <div key={label} className={`p-3 border rounded-xl text-center ${bg}`}>
                          <div className={`text-xl font-extrabold tabular-nums ${grade.cls}`}>
                            {score}%
                          </div>
                          <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5 leading-tight">
                            {label}
                          </div>
                          <div className={`text-[9px] font-bold mt-0.5 ${grade.cls}`}>
                            {grade.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                {/* Recommended Topics */}
                <SectionCard title="Recommended Topics" icon={Lightbulb}>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-4 leading-relaxed">
                    Study these topics before your next interview to close the identified gaps.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {recommendedTopics.map((topic) => (
                      <TopicTag key={topic} topic={topic} />
                    ))}
                  </div>
                </SectionCard>

                {/* Quick stats */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3.5">
                  <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Session Stats
                  </h3>
                  {[
                    { label: 'Questions Answered', value: `${session.answeredQuestions} / ${session.totalQuestions}` },
                    { label: 'Difficulty Level',   value: session.difficulty },
                    { label: 'Interview Type',      value: 'Technical + Behavioral' },
                    { label: 'Company Target',      value: session.company },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {label}
                      </span>
                      <span className="text-xs font-extrabold text-[#111111] dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ── Bottom action strip (mobile-friendly) ────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Ready to improve your score? Practice makes perfect.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </button>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#60A5FA]/50 bg-blue-50/50 dark:bg-blue-950/20 text-[#60A5FA] font-bold text-xs rounded-xl hover:bg-blue-100/60 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Interview
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Back to Dashboard
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
