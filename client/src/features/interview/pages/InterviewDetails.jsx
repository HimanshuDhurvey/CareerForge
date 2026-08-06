import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Gauge,
  Clock,
  CheckCircle2,
  Calendar,
  Code2,
  Sparkles,
  FileText,
  PlusCircle,
  AlertCircle,
  Loader2,
  LayoutDashboard,
  Home,
  History,
  ArrowRight,
  Circle,
  Compass,
} from 'lucide-react';

import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { interviewService } from '../../../services/interviewService';

export default function InterviewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    if (!id) {
      toast.error('No interview session specified');
      navigate('/ai-interviews/history');
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await interviewService.getInterviewById(id);
        setSessionData(data);
      } catch (err) {
        toast.error(err.message || 'Failed to load interview details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Extract variables with clean fallbacks for both new API shape and legacy shape
  const interview = sessionData?.interview || sessionData;
  const config = interview?.configuration || {};
  const totalQ = sessionData?.totalQuestions ?? config.totalQuestions ?? 0;
  const answeredQ = sessionData?.answeredQuestions ?? interview?.userAnswers?.length ?? 0;
  const durationMins = sessionData?.duration ?? interview?.duration ?? 0;
  const aiAvailable = sessionData?.aiEvaluationAvailable ?? false;
  const aiStatus = sessionData?.aiEvaluationStatus || 'Pending';

  const getDifficultyBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900';
      case 'hard':
        return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* Header / Back */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/ai-interviews/history')}
                  aria-label="Back to History"
                  className="p-2 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-4.5 w-4.5" />
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                    Interview Summary & Feedback
                  </h1>
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                    Session details, candidate responses, and next steps in your CareerForge journey.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/ai-interviews/setup')}
                className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <PlusCircle className="h-4 w-4" />
                Start New Interview
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xs">
                <Loader2 className="h-8 w-8 text-[#60A5FA] animate-spin mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Loading Interview Details...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !interview && (
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-12 text-center space-y-4">
                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
                <h3 className="text-base font-extrabold text-[#111111] dark:text-white">
                  Start your first interview
                </h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  No interview details available for this session. Configure and begin your first mock interview to track progress.
                </p>
                <button
                  onClick={() => navigate('/ai-interviews/setup')}
                  className="inline-flex items-center gap-2 h-11 px-6 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <PlusCircle className="h-4 w-4" />
                  Start First Interview
                </button>
              </div>
            )}

            {/* Content */}
            {!loading && interview && (
              <div className="space-y-6">
                {/* ── 1. Success Message Banner ─────────────────────────────── */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-emerald-500 text-white rounded-xl shrink-0">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#111111] dark:text-white">
                        Interview completed successfully.
                      </h2>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">
                        Your answers have been saved and structured for review.
                      </p>
                    </div>
                  </div>

                  {/* Summary Bar Chips */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 text-xs font-extrabold text-[#111111] dark:text-white shadow-2xs">
                      <Briefcase className="h-3.5 w-3.5 text-[#60A5FA]" />
                      {config.role || interview.title || 'Developer'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 text-xs font-extrabold text-[#111111] dark:text-white shadow-2xs">
                      <Gauge className="h-3.5 w-3.5 text-amber-500" />
                      {config.difficulty || 'Medium'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 text-xs font-extrabold text-[#111111] dark:text-white shadow-2xs">
                      <Clock className="h-3.5 w-3.5 text-purple-400" />
                      {durationMins} mins
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 text-xs font-extrabold text-emerald-500 shadow-2xs">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                      {answeredQ} / {totalQ} Answered
                    </span>
                  </div>
                </div>

                {/* ── 2. Session Metadata Hero Card ───────────────────────── */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wide ${getStatusBadge(
                          interview.status
                        )}`}
                      >
                        {interview.status?.replace('_', ' ') || 'Completed'}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-wide ${getDifficultyBadge(
                          config.difficulty
                        )}`}
                      >
                        {config.difficulty || 'Medium'}
                      </span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#111111] dark:text-white">
                      {interview.title || 'Mock Interview Session'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-[#60A5FA]" />
                        {config.role || 'Software Engineer'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Code2 className="h-3.5 w-3.5 text-purple-400" />
                        {config.interviewType || 'Technical'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        Completion Date:{' '}
                        {interview.completedAt
                          ? new Date(interview.completedAt).toLocaleDateString()
                          : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center min-w-[160px]">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Questions Answered
                    </div>
                    <div className="text-2xl font-extrabold text-[#111111] dark:text-white mt-1">
                      {answeredQ} / {totalQ}
                    </div>
                  </div>
                </div>

                {/* ── 3. Grid Layout: Questions + CareerForge Journey ────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column (8 cols): Questions & Candidate Responses */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#60A5FA]" />
                          Questions & Candidate Responses
                        </h3>
                        <span className="text-xs font-bold text-gray-400">
                          {interview.questions?.length || 0} Questions
                        </span>
                      </div>

                      {/* Question Items List */}
                      <div className="space-y-6">
                        {interview.questions?.map((q, index) => {
                          const answerRecord = interview.userAnswers?.find(
                            (a) =>
                              a.questionId?.toString() === q._id?.toString() ||
                              a.questionId?.toString() === q.id?.toString()
                          );

                          return (
                            <div
                              key={q._id || index}
                              className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#60A5FA] border border-blue-100 dark:border-blue-900">
                                      Q{index + 1}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                                      {q.category || 'General'}
                                    </span>
                                  </div>
                                  <h4 className="text-sm font-extrabold text-[#111111] dark:text-white leading-relaxed pt-1">
                                    {q.question}
                                  </h4>
                                </div>
                                <span
                                  className={`shrink-0 px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase ${getDifficultyBadge(
                                    q.difficulty
                                  )}`}
                                >
                                  {q.difficulty}
                                </span>
                              </div>

                              {/* Expected Topics */}
                              {q.expectedTopics?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-200/50 dark:border-gray-800">
                                  {q.expectedTopics.map((topic, i) => (
                                    <span
                                      key={i}
                                      className="px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-md border border-purple-100 dark:border-purple-900/50"
                                    >
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Answer Box */}
                              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl p-4 space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  <span>Submitted Answer</span>
                                  {answerRecord?.timeTaken > 0 && (
                                    <span>Time Taken: {answerRecord.timeTaken}s</span>
                                  )}
                                </div>
                                {answerRecord ? (
                                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {answerRecord.userAnswer}
                                  </p>
                                ) : (
                                  <p className="text-xs font-medium text-amber-500 italic">
                                    No answer recorded for this question.
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (4 cols): CareerForge Journey Progress Tracker */}
                  <div className="lg:col-span-4 space-y-5">
                    {/* CareerForge Journey Card */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider flex items-center gap-2">
                          <Compass className="h-4 w-4 text-[#60A5FA]" />
                          CareerForge Journey
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                          Active
                        </span>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                        {[
                          { label: 'Profile Completed', status: 'completed' },
                          { label: 'Resume Uploaded', status: 'completed' },
                          { label: 'Interview Completed', status: 'completed' },
                          { label: 'AI Evaluation', status: 'upcoming' },
                          { label: 'Analytics', status: 'upcoming' },
                          { label: 'Personalized Roadmap', status: 'upcoming' },
                        ].map((step, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span
                              className={`font-bold ${
                                step.status === 'completed'
                                  ? 'text-[#111111] dark:text-white'
                                  : 'text-gray-400 dark:text-gray-500'
                              }`}
                            >
                              {step.label}
                            </span>
                            {step.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-500">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                Done
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-gray-400">
                                <Circle className="h-3 w-3 text-gray-300 dark:text-gray-600" />
                                Upcoming
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Report Placeholder State Note */}
                    <div className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-[#60A5FA]">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-extrabold uppercase tracking-wide">
                          AI Evaluation Status
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                        Complete AI Evaluation in the next phase. Dataset saved and prepared for automated grading.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── 4. WHAT'S NEXT? Section ─────────────────────────────── */}
                <div className="space-y-4 pt-4 border-t border-gray-200/60 dark:border-gray-800">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#111111] dark:text-white tracking-tight">
                      What's Next?
                    </h2>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                      Choose your next step to continue optimizing your interview skills.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* 1. Start New Interview */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#60A5FA]/50 transition-colors">
                      <div className="space-y-2">
                        <div className="p-2.5 w-fit rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#60A5FA]">
                          <PlusCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          Start New Interview
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Begin another interview with a new role, company, or difficulty configuration.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/ai-interviews/setup')}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        Configure Interview
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* 2. AI Evaluation (Coming in Next Phase) */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-500">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          AI Evaluation
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Generate comprehensive AI feedback, overall score, and improvement report.
                        </p>
                      </div>
                      <button
                        disabled={!aiAvailable}
                        onClick={() => {
                          if (aiAvailable) {
                            navigate(`/ai-interviews/feedback/${id}`);
                          }
                        }}
                        className={`w-full inline-flex items-center justify-center gap-2 h-10 font-bold text-xs rounded-xl transition-colors ${
                          aiAvailable
                            ? 'bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shadow-xs'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        {aiAvailable ? 'View AI Feedback' : 'Coming Soon'}
                      </button>
                    </div>

                    {/* 3. Interview History */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#60A5FA]/50 transition-colors">
                      <div className="space-y-2">
                        <div className="p-2.5 w-fit rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
                          <History className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          Interview History
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Review all your past mock interview sessions, questions, and responses.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/ai-interviews/history')}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        View History
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* 4. Dashboard */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#60A5FA]/50 transition-colors">
                      <div className="space-y-2">
                        <div className="p-2.5 w-fit rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500">
                          <LayoutDashboard className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          Dashboard
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Return to main candidate overview to monitor overall preparation stats.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Go to Dashboard
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* 5. Home */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#60A5FA]/50 transition-colors">
                      <div className="space-y-2">
                        <div className="p-2.5 w-fit rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-500">
                          <Home className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          Home
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Back to CareerForge main home landing and feature catalog.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/')}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Go Home
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* 6. Resume Analyzer */}
                    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#60A5FA]/50 transition-colors">
                      <div className="space-y-2">
                        <div className="p-2.5 w-fit rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
                          <FileText className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white">
                          Resume Analyzer
                        </h3>
                        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed">
                          Scan and optimize your resume keywords for your target role.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/resume-analyzer')}
                        className="w-full inline-flex items-center justify-center gap-2 h-10 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-[#111111] dark:text-white border border-[#E5E7EB] dark:border-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Open Resume Analyzer
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
