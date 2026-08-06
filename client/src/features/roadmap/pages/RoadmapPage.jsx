import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map, Sparkles, Target, Award, Clock, TrendingUp, CheckCircle2,
  ChevronDown, ChevronUp, BookOpen, Video, Code2, ExternalLink,
  FileText, RefreshCw, Trash2, Eye, AlertTriangle, Plus, Layers,
  Zap, Check, RotateCcw, PlayCircle, ArrowRight, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { roadmapService } from '../../../services/roadmapService';

// ─── Resource Icon Helper ───────────────────────────────────────────────────
function getResourceBadge(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('video')) {
    return {
      icon: PlayCircle,
      bg: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50',
      label: 'Video',
    };
  }
  if (t.includes('practice')) {
    return {
      icon: Code2,
      bg: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50',
      label: 'Practice',
    };
  }
  return {
    icon: BookOpen,
    bg: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
    label: 'Documentation',
  };
}

// ─── Skeleton Loader Component ──────────────────────────────────────────────
function RoadmapSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
      {/* Summary Skeleton */}
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      {/* Skills Skeleton */}
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      {/* Weekly Accordion Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data States
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [hasResume, setHasResume] = useState(true);
  const [hasInterview, setHasInterview] = useState(true);

  // UI Control States
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: true });
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Load latest roadmap and history
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await roadmapService.getLatestRoadmap();
      setActiveRoadmap(data.roadmap);
      setHasResume(data.hasResume);
      setHasInterview(data.hasInterview);

      const historyData = await roadmapService.getRoadmapHistory();
      setHistory(historyData);
    } catch (err) {
      toast.error(err.message || 'Failed to load career roadmap');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Generate roadmap handler
  const handleGenerate = async (customGoal = '') => {
    if (!hasResume) {
      toast.error('Please upload your resume before generating a roadmap!');
      navigate('/resume');
      return;
    }
    if (!hasInterview) {
      toast.error('Please complete an AI interview session first!');
      navigate('/ai-interviews');
      return;
    }

    try {
      setGenerating(true);
      setShowGoalModal(false);
      const newRoadmap = await roadmapService.generateRoadmap({
        careerGoal: customGoal || undefined,
      });
      setActiveRoadmap(newRoadmap);
      toast.success('AI Career Roadmap generated successfully!');

      // Refresh history
      const historyData = await roadmapService.getRoadmapHistory();
      setHistory(historyData);
    } catch (err) {
      if (err.code === 'MISSING_RESUME') {
        setHasResume(false);
      } else if (err.code === 'MISSING_INTERVIEW') {
        setHasInterview(false);
      }
      toast.error(err.message || 'Failed to generate AI roadmap');
    } finally {
      setGenerating(false);
    }
  };

  // Switch roadmap view from history
  const handleViewRoadmap = async (id) => {
    try {
      setLoading(true);
      const roadmapDetails = await roadmapService.getRoadmapById(id);
      setActiveRoadmap(roadmapDetails);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.message || 'Failed to load roadmap details');
    } finally {
      setLoading(false);
    }
  };

  // Delete roadmap handler
  const handleDeleteRoadmap = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this generated roadmap?')) return;

    try {
      await roadmapService.deleteRoadmap(id);
      toast.success('Roadmap deleted');
      if (activeRoadmap?._id === id) {
        setActiveRoadmap(null);
      }
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete roadmap');
    }
  };

  // Toggle week accordion
  const toggleWeek = (weekNum) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  // Toggle week completion status
  const toggleWeekCompleted = (weekNum, e) => {
    e.stopPropagation();
    setCompletedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
    toast.success(`Week ${weekNum} status updated!`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* SECTION 1: Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <Map className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Career Roadmap
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="h-3 w-3" />
                  AI Telemetry Engine
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                Personalized week-by-week growth plan synthesized directly from your Resume Analysis, AI Mock Interview evaluation, and target career goals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeRoadmap ? (
                <button
                  onClick={() => setShowGoalModal(true)}
                  disabled={generating}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating AI Roadmap...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Generate New Roadmap
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleGenerate()}
                  disabled={generating}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Generate Roadmap
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* EMPTY STATE: Missing Resume */}
          {!hasResume && (
            <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                    Resume Upload Required
                  </h3>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                    Your AI Roadmap requires resume telemetry to extract key skills and identify technical gaps.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/resume')}
                className="whitespace-nowrap px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                Upload Resume
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* EMPTY STATE: Missing Interview */}
          {hasResume && !hasInterview && (
            <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
                    Complete an AI Interview Session
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                    Complete at least one mock interview round to evaluate communication and technical problem-solving.
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/ai-interviews')}
                className="whitespace-nowrap px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
              >
                Complete Interview
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* LOADING STATE */}
          {(loading || generating) ? (
            <RoadmapSkeleton />
          ) : !activeRoadmap ? (
            /* EMPTY STATE: Roadmap Not Generated */
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xs">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-full">
                <Map className="h-12 w-12" />
              </div>
              <div className="max-w-md space-y-1">
                <h2 className="text-lg font-extrabold text-[#111111] dark:text-white">
                  Generate Your First AI Career Roadmap
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Synthesize your resume skills and mock interview scores into a custom week-by-week execution plan with practical projects, resources, and target milestones.
                </p>
              </div>
              <button
                onClick={() => handleGenerate()}
                disabled={generating || !hasResume || !hasInterview}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                Generate First Roadmap Now
              </button>
            </div>
          ) : (
            /* ACTIVE ROADMAP DISPLAY */
            <div className="space-y-6">
              {/* SECTION 2: Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Career Goal */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-xl">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Career Goal
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white truncate max-w-[150px]" title={activeRoadmap.careerGoal}>
                      {activeRoadmap.careerGoal}
                    </h3>
                  </div>
                </div>

                {/* Card 2: Current Level */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 text-purple-500 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Current Level
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                      {activeRoadmap.currentLevel}
                    </h3>
                  </div>
                </div>

                {/* Card 3: Career Readiness */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Career Readiness
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-emerald-500">
                        {activeRoadmap.careerReadiness}%
                      </span>
                      <div className="w-16 bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, activeRoadmap.careerReadiness)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 4: Estimated Duration */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Estimated Duration
                    </span>
                    <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                      {activeRoadmap.estimatedDuration || '8 Weeks'}
                    </h3>
                  </div>
                </div>
              </div>

              {/* SECTION 3: AI Summary */}
              <div className="bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-purple-900/10 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-xs">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Recruiter-Style Executive AI Guidance Summary
                    </h2>
                    <p className="text-xs text-[#333333] dark:text-gray-300 leading-relaxed font-medium">
                      {activeRoadmap.summary}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Priority Skills */}
              {activeRoadmap.prioritySkills && activeRoadmap.prioritySkills.length > 0 && (
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500" />
                      <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                        Priority Target Skills
                      </h3>
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Focus Areas
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {activeRoadmap.prioritySkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl text-xs font-semibold text-[#111111] dark:text-gray-200"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTION 5: Weekly Roadmap Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                      Weekly Learning Timeline
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {activeRoadmap.weeklyPlan?.length || 0} Total Weeks
                  </span>
                </div>

                <div className="space-y-3">
                  {activeRoadmap.weeklyPlan?.map((weekItem) => {
                    const isExpanded = !!expandedWeeks[weekItem.week];
                    const isCompleted = !!completedWeeks[weekItem.week];

                    return (
                      <div
                        key={weekItem.week}
                        className={`bg-white dark:bg-[#111827] border transition-all duration-200 rounded-2xl overflow-hidden shadow-xs ${
                          isCompleted
                            ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                            : 'border-[#E5E7EB] dark:border-gray-800'
                        }`}
                      >
                        {/* Weekly Header / Collapsible trigger */}
                        <div
                          onClick={() => toggleWeek(weekItem.week)}
                          className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3.5">
                            {/* Week number badge */}
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-xs ${
                              isCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-blue-500 text-white'
                            }`}>
                              W{weekItem.week}
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-[#111111] dark:text-white">
                                  {weekItem.title}
                                </h4>
                                {isCompleted && (
                                  <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                                    Completed
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {weekItem.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                              <Clock className="h-3.5 w-3.5" />
                              {weekItem.estimatedHours || 10} Hours
                            </span>

                            <button
                              onClick={(e) => toggleWeekCompleted(weekItem.week, e)}
                              title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                              className={`p-2 rounded-xl transition-all cursor-pointer ${
                                isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                              }`}
                            >
                              <Check className="h-4 w-4" />
                            </button>

                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible Content Body */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800/60 space-y-4">
                            {/* Full Description */}
                            <p className="text-xs text-[#555555] dark:text-gray-300 leading-relaxed">
                              {weekItem.description}
                            </p>

                            {/* Skills for Week */}
                            {weekItem.skills && weekItem.skills.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                  Skills Covered
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {weekItem.skills.map((s, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-900/50 text-[11px] font-medium rounded-lg"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Resources */}
                            {weekItem.resources && weekItem.resources.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                                  Learning Resources
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {weekItem.resources.map((res, rIdx) => {
                                    const badge = getResourceBadge(res.type);
                                    const IconComp = badge.icon;

                                    return (
                                      <a
                                        key={rIdx}
                                        href={res.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl transition-colors group"
                                      >
                                        <div className="flex items-center gap-2.5 truncate pr-2">
                                          <div className={`p-1.5 rounded-lg border text-xs ${badge.bg}`}>
                                            <IconComp className="h-3.5 w-3.5" />
                                          </div>
                                          <span className="text-xs font-semibold text-[#111111] dark:text-gray-200 truncate group-hover:text-blue-500 transition-colors">
                                            {res.title}
                                          </span>
                                        </div>
                                        <ExternalLink className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Mini Project */}
                            {weekItem.miniProject && (
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-1">
                                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider">
                                  <Code2 className="h-3.5 w-3.5" />
                                  Weekly Practical Mini-Project
                                </div>
                                <p className="text-xs font-bold text-[#111111] dark:text-white">
                                  {weekItem.miniProject}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 6 & 7: Recommended Projects & Certifications (2 Column Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SECTION 6: Recommended Projects */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-purple-500" />
                    <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                      Recommended Projects
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeRoadmap.recommendedProjects?.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-xl space-y-1.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-purple-500" />
                          <h4 className="text-xs font-bold text-[#111111] dark:text-white">
                            {typeof proj === 'string' ? proj : proj.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SECTION 7: Recommended Certifications */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                      Recommended Certifications
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {activeRoadmap.recommendedCertifications?.map((cert, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Award className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-xs font-bold text-[#111111] dark:text-white">
                            {cert}
                          </span>
                        </div>
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(cert)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1"
                        >
                          Explore
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 8: Roadmap History */}
              {history && history.length > 0 && (
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                        Generated Roadmap History
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 font-bold">
                      {history.length} Saved
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {history.map((item) => (
                      <div
                        key={item._id}
                        className="py-3 flex items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 px-2 rounded-xl transition-colors"
                      >
                        <div className="space-y-0.5 truncate">
                          <h4 className="text-xs font-bold text-[#111111] dark:text-white truncate">
                            {item.careerGoal}
                          </h4>
                          <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="text-emerald-500 font-bold">
                              {item.careerReadiness}% Readiness
                            </span>
                            <span>•</span>
                            <span>{item.currentLevel}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleViewRoadmap(item._id)}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 text-xs font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>
                          <button
                            onClick={(e) => handleDeleteRoadmap(item._id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Custom Career Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-[#111111] dark:text-white">
                Generate New Roadmap
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Specify a target role or leave blank to use your profile target role.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                Target Role / Career Goal
              </label>
              <input
                type="text"
                value={customGoalInput}
                onChange={(e) => setCustomGoalInput(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer, AI Engineer"
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-[#111111] dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleGenerate(customGoalInput)}
                disabled={generating}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-2"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate AI Roadmap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
