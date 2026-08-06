import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowLeft,
  FileText,
} from 'lucide-react';

import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import ScoreBar from '../components/ScoreBar';
import FeedbackList from '../components/FeedbackList';
import TopicTag from '../components/TopicTag';
import { aiEvaluationService } from '../../../services/aiEvaluationService';

// ─── Helper: grade label from score ──────────────────────────────────────────
function getGrade(score) {
  if (score >= 90) return { label: 'Excellent', cls: 'text-emerald-500' };
  if (score >= 80) return { label: 'Good', cls: 'text-blue-500' };
  if (score >= 65) return { label: 'Average', cls: 'text-amber-500' };
  return { label: 'Needs Work', cls: 'text-red-500' };
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
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      const interviewId = id || location.state?.interviewId;

      if (!interviewId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await aiEvaluationService.getEvaluation(interviewId);
        setEvaluation(data);
      } catch (err) {
        // If not generated yet, try to generate it now
        try {
          const generated = await aiEvaluationService.evaluateInterview(interviewId);
          setEvaluation(generated);
        } catch (genErr) {
          toast.error(genErr.message || 'Failed to load AI evaluation report');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluation();
  }, [id, location.state]);

  const handleDownload = () => {
    window.print();
  };

  const handleRetry = () => {
    navigate('/ai-interviews/setup');
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] justify-center items-center">
        <Loader2 className="h-10 w-10 text-purple-500 animate-spin mb-4" />
        <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
          Retrieving AI Evaluation Report...
        </h2>
        <p className="text-xs font-semibold text-gray-400 mt-1">
          Powered by Gemini AI Engine
        </p>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-[#0b0f19] p-6 justify-center items-center">
        <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-8 max-w-md text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
          <h2 className="text-base font-extrabold text-[#111111] dark:text-white">
            No Evaluation Report Available
          </h2>
          <p className="text-xs text-gray-400">
            Please complete an interview session first and click "Generate AI Evaluation".
          </p>
          <button
            onClick={() => navigate('/ai-interviews/history')}
            className="inline-flex items-center gap-2 h-10 px-5 bg-[#60A5FA] text-white font-bold text-xs rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Interview History
          </button>
        </div>
      </div>
    );
  }

  const sessionMeta = evaluation.interview || {};
  const overallScore = evaluation.overallScore || 0;
  const technicalScore = evaluation.technicalScore || 0;
  const communicationScore = evaluation.communicationScore || 0;
  const problemSolvingScore = evaluation.problemSolvingScore || 0;
  const strengths = evaluation.strengths || [];
  const weaknesses = evaluation.weaknesses || [];
  const recommendations = evaluation.recommendations || [];
  const questionAnalysis = evaluation.questionAnalysis || [];

  const overallGrade = getGrade(overallScore);

  const subScores = [
    { label: 'Technical Accuracy', score: technicalScore, icon: Code2 },
    { label: 'Communication', score: communicationScore, icon: MessageSquare },
    { label: 'Problem Solving', score: problemSolvingScore, icon: Brain },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-purple-500">
                  <Sparkles className="h-4.5 w-4.5" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">
                    Gemini AI Interview Report
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  {sessionMeta.title || 'Technical Interview Session'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-gray-400 dark:text-gray-500">
                  <span>{sessionMeta.role || 'Developer'}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>{sessionMeta.difficulty || 'Medium'} Difficulty</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                  <span>{sessionMeta.duration || 15} Mins Duration</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 shrink-0">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Print / Save PDF
                </button>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 h-11 px-5 border border-[#60A5FA]/50 bg-blue-50/50 dark:bg-blue-950/20 text-[#60A5FA] font-bold text-xs rounded-xl hover:bg-blue-100/60 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  New Interview
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
                <SectionCard title="Overall AI Performance Grade" icon={Trophy}>
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    {/* Ring + grade */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div className="relative w-[120px] h-[120px]">
                        <svg width="120" height="120" className="-rotate-90 absolute inset-0">
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="10"
                            className="text-gray-100 dark:text-gray-800"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="50"
                            fill="none"
                            stroke={
                              overallScore >= 85
                                ? '#10B981'
                                : overallScore >= 70
                                ? '#60A5FA'
                                : overallScore >= 55
                                ? '#F59E0B'
                                : '#EF4444'
                            }
                            strokeWidth="10"
                            strokeDasharray={2 * Math.PI * 50}
                            strokeDashoffset={2 * Math.PI * 50 * (1 - overallScore / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-extrabold text-[#111111] dark:text-white tabular-nums leading-none">
                            {overallScore}
                            <span className="text-sm font-bold text-gray-400">%</span>
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase tracking-wide mt-1 ${overallGrade.cls}`}
                          >
                            {overallGrade.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Sub-scores summary */}
                    <div className="flex-1 w-full space-y-3.5">
                      {subScores.map(({ label, score, icon }) => (
                        <ScoreBar key={label} label={label} score={score} icon={icon} />
                      ))}
                    </div>
                  </div>

                  {/* Executive Summary */}
                  {evaluation.overallFeedback && (
                    <div className="mt-5 p-4 bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-xl">
                      <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                        Executive Summary
                      </h4>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed">
                        {evaluation.overallFeedback}
                      </p>
                    </div>
                  )}
                </SectionCard>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FeedbackList title="Strengths Identified" items={strengths} variant="strength" />
                  <FeedbackList title="Areas for Growth" items={weaknesses} variant="weakness" />
                </div>

                {/* AI Suggestions / Recommendations */}
                <SectionCard title="Actionable Recommendations" icon={Sparkles}>
                  <ul className="space-y-4">
                    {recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-3.5">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center text-[10px] font-extrabold">
                          {idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
                          {rec}
                        </p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>

                {/* Question-wise Analysis */}
                <SectionCard title="Question-Wise Evaluation Breakdown" icon={FileText}>
                  <div className="space-y-5">
                    {questionAnalysis.map((item, idx) => {
                      const qGrade = getGrade(item.score);
                      return (
                        <div
                          key={item.questionId || idx}
                          className="bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl p-5 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#60A5FA]">
                                Question {idx + 1}
                              </span>
                              <h4 className="text-xs font-extrabold text-[#111111] dark:text-white leading-relaxed pt-1">
                                {item.questionText || `Question ${idx + 1}`}
                              </h4>
                            </div>
                            <span
                              className={`shrink-0 text-xs font-extrabold px-2.5 py-1 rounded-lg border ${qGrade.cls} bg-white dark:bg-[#111827]`}
                            >
                              {item.score}%
                            </span>
                          </div>

                          {item.feedback && (
                            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#111827] p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                              {item.feedback}
                            </p>
                          )}

                          {/* Specific Improvements */}
                          {item.improvements?.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
                                Key Improvements Needed:
                              </span>
                              <ul className="list-disc list-inside text-xs text-gray-500 dark:text-gray-400 space-y-0.5 pl-1">
                                {item.improvements.map((imp, i) => (
                                  <li key={i}>{imp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              </div>

              {/* RIGHT: Sidebar (4 cols) */}
              <div className="lg:col-span-4 space-y-5">
                {/* Score breakdown card */}
                <SectionCard title="Score Metric Grid" icon={Star}>
                  <div className="grid grid-cols-2 gap-3">
                    {subScores.map(({ label, score }) => {
                      const grade = getGrade(score);
                      return (
                        <div
                          key={label}
                          className="p-3 border rounded-xl text-center bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800"
                        >
                          <div className={`text-xl font-extrabold tabular-nums ${grade.cls}`}>
                            {score}%
                          </div>
                          <div className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider mt-0.5 leading-tight">
                            {label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>

                {/* Session Stats */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3.5">
                  <h3 className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    Session Stats
                  </h3>
                  {[
                    { label: 'Target Role', value: sessionMeta.role || 'Developer' },
                    { label: 'Difficulty', value: sessionMeta.difficulty || 'Medium' },
                    { label: 'Interview Type', value: sessionMeta.interviewType || 'Technical' },
                    { label: 'Duration', value: `${sessionMeta.duration || 15} Mins` },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0 text-xs"
                    >
                      <span className="font-bold text-gray-400 uppercase tracking-wide text-[9px]">
                        {label}
                      </span>
                      <span className="font-extrabold text-[#111111] dark:text-white">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center sm:text-left">
                Ready to take another mock interview and improve your score?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-4 w-4" />
                  Start Next Interview
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
