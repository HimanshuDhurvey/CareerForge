import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Map as MapIcon, Sparkles, Target, Award, Clock, TrendingUp, CheckCircle2,
  ChevronDown, ChevronUp, ChevronRight, BookOpen, Video, Code2, ExternalLink,
  FileText, RefreshCw, Trash2, Eye, AlertTriangle, Plus, Layers,
  Zap, Check, RotateCcw, PlayCircle, ArrowRight, Loader2, X,
  Lock, LayoutList, GitCommit, CheckCircle, ShieldCheck, HelpCircle
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

// ─── Difficulty Pill Helper ─────────────────────────────────────────────────
function getDifficultyBadge(diff) {
  const d = (diff || '').toLowerCase();
  if (d.includes('beginner') || d.includes('easy')) {
    return {
      label: 'Beginner',
      bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    };
  }
  if (d.includes('advanced') || d.includes('hard')) {
    return {
      label: 'Advanced',
      bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    };
  }
  return {
    label: 'Intermediate',
    bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  };
}

// ─── Skeleton Loader Component ──────────────────────────────────────────────
function RoadmapSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
      <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
      <div className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full" />
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

  // View Switcher Mode: 'timeline' | 'visual'
  const [viewMode, setViewMode] = useState('visual');

  // Data States
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [hasResume, setHasResume] = useState(true);
  const [hasInterview, setHasInterview] = useState(true);

  // UI Control States
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: true });
  const [customGoalInput, setCustomGoalInput] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Selected Node Side Panel / Inspection Modal State
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [togglingNodeId, setTogglingNodeId] = useState(null);

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

  // Telemetry Aggregation for Progress Header
  const progressTelemetry = useMemo(() => {
    if (!activeRoadmap || !Array.isArray(activeRoadmap.weeklyPlan)) {
      return {
        totalNodes: 0,
        completedNodes: 0,
        progressPercent: 0,
        remainingSkills: 0,
        remainingHours: 0,
        careerReadiness: 0,
      };
    }

    const totalNodes = activeRoadmap.weeklyPlan.length;
    const completedNodes = activeRoadmap.weeklyPlan.filter((n) => n && n.completed).length;
    const progressPercent = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

    const uncompletedNodes = activeRoadmap.weeklyPlan.filter((n) => n && !n.completed);
    const remainingSkills = uncompletedNodes.flatMap((n) => (n && Array.isArray(n.skills) ? n.skills : [])).length;
    const remainingHours = uncompletedNodes.reduce((acc, n) => acc + (n?.estimatedHours || 10), 0);

    return {
      totalNodes,
      completedNodes,
      progressPercent,
      remainingSkills,
      remainingHours,
      careerReadiness: activeRoadmap.careerReadiness || 70,
    };
  }, [activeRoadmap]);

  // Stage Grouping for Visual Path
  const stagesData = useMemo(() => {
    if (!activeRoadmap || !Array.isArray(activeRoadmap.weeklyPlan)) return [];

    const defaultStageNames = [
      'Stage 1: Programming Fundamentals',
      'Stage 2: Core Stack & Architecture',
      'Stage 3: Systems & Data Engineering',
      'Stage 4: Cloud, Microservices & Queues',
      'Stage 5: High Availability & Scaling',
      'Stage 6: Capstone Portfolio Projects',
      'Stage 7: FAANG Interview Preparation',
    ];

    const stagesMap = new Map();
    let firstIncompleteFound = false;

    activeRoadmap.weeklyPlan.forEach((node, idx) => {
      if (!node) return;
      const stageName =
        node.stage || defaultStageNames[Math.min(defaultStageNames.length - 1, Math.floor(idx / 1.2))];

      // Infer node status
      let status = 'available';
      if (node.completed) {
        status = 'completed';
      } else if (!firstIncompleteFound) {
        status = 'current';
        firstIncompleteFound = true;
      } else {
        const prevCompleted = idx === 0 || activeRoadmap.weeklyPlan[idx - 1]?.completed;
        status = prevCompleted ? 'available' : 'locked';
      }

      const title = node.title || `Week ${node.week || idx + 1} Focus`;

      const enrichedNode = {
        ...node,
        title,
        stage: stageName,
        status,
        difficulty: node.difficulty || (idx < 2 ? 'Beginner' : idx < 5 ? 'Intermediate' : 'Advanced'),
        whyItMatters:
          node.whyItMatters ||
          `Mastering ${title} addresses critical candidate weaknesses identified in your resume and interview analysis.`,
        aiTips:
          node.aiTips ||
          `Focus on concrete code implementations, time complexity, and edge-case handling during mock evaluations.`,
      };

      if (!stagesMap.has(stageName)) {
        stagesMap.set(stageName, []);
      }
      stagesMap.get(stageName).push(enrichedNode);
    });

    return Array.from(stagesMap.entries()).map(([title, nodes]) => ({
      title,
      nodes,
    }));
  }, [activeRoadmap]);

  // Generate new roadmap handler
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

  // Toggle persistent completion status for a node
  const handleToggleNodeCompletion = async (nodeId, targetStatus, e) => {
    if (e) e.stopPropagation();
    try {
      const keyStr = nodeId ? nodeId.toString() : '';
      setTogglingNodeId(keyStr);

      const updatedRes = targetStatus
        ? await roadmapService.markNodeComplete(keyStr)
        : await roadmapService.markNodeReset(keyStr);

      setActiveRoadmap(updatedRes.roadmap);
      toast.success(targetStatus ? 'Node marked as completed!' : 'Node reset to available.');

      if (
        selectedNode &&
        (selectedNode._id?.toString() === keyStr || selectedNode.week?.toString() === keyStr)
      ) {
        setSelectedNode((prev) => ({
          ...prev,
          completed: targetStatus,
          status: targetStatus ? 'completed' : 'current',
        }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update node status');
    } finally {
      setTogglingNodeId(null);
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

  // Open side inspection panel for a node
  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setIsPanelOpen(true);
  };

  // Toggle week accordion in timeline view
  const toggleWeek = (weekNum) => {
    setExpandedWeeks((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(true)} />

        <main className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* SECTION 1: Page Header & View Switcher Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                  <MapIcon className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Career Roadmap
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Sparkles className="h-3 w-3" />
                  AI Telemetry Engine
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                Personalized week-by-week growth journey synthesized directly from your Resume Analysis, AI Mock Interview evaluation, and target career goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* VIEW SWITCHER TABS */}
              <div className="p-1 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center gap-1 border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-white dark:bg-[#111827] text-blue-600 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutList className="h-3.5 w-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setViewMode('visual')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                    viewMode === 'visual'
                      ? 'bg-white dark:bg-[#111827] text-blue-600 dark:text-white shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <GitCommit className="h-3.5 w-3.5" />
                  <span>Visual Path</span>
                </button>
              </div>

              {/* GENERATE BUTTON */}
              {activeRoadmap ? (
                <button
                  onClick={() => setShowGoalModal(true)}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating AI...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Generate New
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleGenerate()}
                  disabled={generating}
                  className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
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

          {/* OVERALL PROGRESS HEADER BAR */}
          {activeRoadmap && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h2 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                    Overall Learning Journey Telemetry
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="text-emerald-500">
                    {progressTelemetry.completedNodes} of {progressTelemetry.totalNodes} Nodes Completed
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-500">
                    {progressTelemetry.careerReadiness}% Career Readiness
                  </span>
                </div>
              </div>

              {/* Progress Bar & Stats Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Progress Bar */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-700 dark:text-gray-300">
                      Roadmap Completion
                    </span>
                    <span className="font-black text-blue-500 text-sm">
                      {progressTelemetry.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-700 shadow-xs"
                      style={{ width: `${progressTelemetry.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3 Metric Cards */}
                <div className="lg:col-span-6 grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Completed Skills
                    </span>
                    <span className="text-base font-black text-emerald-500">
                      {progressTelemetry.completedNodes}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Remaining Skills
                    </span>
                    <span className="text-base font-black text-blue-500">
                      {progressTelemetry.remainingSkills}
                    </span>
                  </div>

                  <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Time Remaining
                    </span>
                    <span className="text-base font-black text-amber-500">
                      {progressTelemetry.remainingHours} hrs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

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
                <MapIcon className="h-12 w-12" />
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

              {/* MODE SWITCH: VISUAL PATH VIEW vs TIMELINE VIEW */}
              {viewMode === 'visual' ? (
                /* VISUAL PATH VIEW */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-4.5 w-4.5 text-blue-500" />
                      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                        Interactive Visual Learning Path
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      <span className="flex items-center gap-1 text-emerald-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Completed
                      </span>
                      <span className="flex items-center gap-1 text-blue-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" /> Current Focus
                      </span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-400" /> Available
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" /> Locked
                      </span>
                    </div>
                  </div>

                  {/* STAGES LEARNING PATH TREE */}
                  <div className="space-y-8 relative">
                    {stagesData.map((stageGroup, sIdx) => (
                      <div key={sIdx} className="space-y-4 relative">
                        {/* Stage Header */}
                        <div className="flex items-center gap-3 bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl">
                          <div className="p-1.5 bg-blue-500 text-white rounded-lg font-black text-xs">
                            S{sIdx + 1}
                          </div>
                          <h4 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
                            {stageGroup.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-bold ml-auto">
                            {stageGroup.nodes.length} {stageGroup.nodes.length === 1 ? 'Step' : 'Steps'}
                          </span>
                        </div>

                        {/* Connected Node Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative pl-4 sm:pl-6 border-l-2 border-blue-500/30 dark:border-blue-500/20 ml-3 sm:ml-5">
                          {stageGroup.nodes.map((node) => {
                            const diffBadge = getDifficultyBadge(node.difficulty);
                            const isCompleted = node.status === 'completed';
                            const isCurrent = node.status === 'current';
                            const isLocked = node.status === 'locked';

                            return (
                              <div
                                key={node.week || node._id}
                                onClick={() => handleNodeClick(node)}
                                className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${
                                  isCompleted
                                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-900/50 hover:border-emerald-500'
                                    : isCurrent
                                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-800 shadow-md ring-2 ring-blue-500/20 hover:border-blue-500'
                                    : isLocked
                                    ? 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-800/60 opacity-60'
                                    : 'bg-white dark:bg-[#111827] border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:shadow-xs'
                                }`}
                              >
                                {/* Node Top Row */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${diffBadge.bg}`}>
                                      {diffBadge.label}
                                    </span>
                                    <span className="text-[10px] font-extrabold text-gray-400">
                                      Week {node.week}
                                    </span>
                                  </div>

                                  {/* Status Icon Indicator */}
                                  <div>
                                    {isCompleted ? (
                                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                                        <CheckCircle className="h-3 w-3" />
                                        Completed
                                      </span>
                                    ) : isCurrent ? (
                                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-full animate-pulse">
                                        <Sparkles className="h-3 w-3" />
                                        Current Focus
                                      </span>
                                    ) : isLocked ? (
                                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        <Lock className="h-3 w-3" />
                                        Locked
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-[10px] font-extrabold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        Available
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Node Skill Title */}
                                <div>
                                  <h5 className="text-sm font-extrabold text-[#111111] dark:text-white group-hover:text-blue-500 transition-colors line-clamp-1">
                                    {node.title}
                                  </h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                    {node.description}
                                  </p>
                                </div>

                                {/* Node Bottom Info */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800/60 text-[11px] text-gray-400 font-bold">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    {node.estimatedHours || 10} Hours
                                  </span>

                                  <span className="text-blue-500 group-hover:underline flex items-center gap-0.5">
                                    Inspect Node
                                    <ChevronRight className="h-3.5 w-3.5" />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* TIMELINE VIEW (Unchanged original accordion view) */
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
                      const isCompleted = !!weekItem.completed;

                      return (
                        <div
                          key={weekItem.week}
                          className={`bg-white dark:bg-[#111827] border transition-all duration-200 rounded-2xl overflow-hidden shadow-xs ${
                            isCompleted
                              ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'border-[#E5E7EB] dark:border-gray-800'
                          }`}
                        >
                          <div
                            onClick={() => toggleWeek(weekItem.week)}
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors"
                          >
                            <div className="flex items-center gap-3.5">
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
                                onClick={(e) => handleToggleNodeCompletion(weekItem._id || weekItem.week, !isCompleted, e)}
                                title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                                className={`p-2 rounded-xl transition-all cursor-pointer ${
                                  isCompleted
                                    ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                }`}
                              >
                                {togglingNodeId === (weekItem._id || weekItem.week) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </button>

                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800/60 space-y-4">
                              <p className="text-xs text-[#555555] dark:text-gray-300 leading-relaxed">
                                {weekItem.description}
                              </p>

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
              )}

              {/* SECTION 6 & 7: Recommended Projects & Certifications (2 Column Grid) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* NODE INSPECTION SIDE PANEL MODAL */}
      {isPanelOpen && selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="bg-white dark:bg-[#111827] border-l border-[#E5E7EB] dark:border-gray-800 w-full max-w-lg h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            <div className="space-y-5">
              {/* Panel Top Header */}
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-500 uppercase tracking-widest block">
                    {selectedNode.stage || 'Learning Path Node'}
                  </span>
                  <h3 className="text-lg font-black text-[#111111] dark:text-white">
                    Week {selectedNode.week}: {selectedNode.title}
                  </h3>
                </div>
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status & Difficulty Badges */}
              <div className="flex items-center gap-3">
                <span className={`text-xs font-black px-3 py-1 rounded-full ${getDifficultyBadge(selectedNode.difficulty).bg}`}>
                  {getDifficultyBadge(selectedNode.difficulty).label}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Estimated Study: {selectedNode.estimatedHours || 10} Hours
                </span>
              </div>

              {/* Node Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                  Objective & Focus
                </h4>
                <p className="text-xs text-[#444444] dark:text-gray-300 leading-relaxed font-medium">
                  {selectedNode.description}
                </p>
              </div>

              {/* Why This Skill Matters (AI Context) */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="h-4 w-4" />
                  Why This Skill Matters (AI Career Telemetry)
                </div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedNode.whyItMatters}
                </p>
              </div>

              {/* Recommended Resources */}
              {selectedNode.resources && selectedNode.resources.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                    Recommended Study Resources
                  </h4>
                  <div className="space-y-2">
                    {selectedNode.resources.map((res, rIdx) => {
                      const badge = getResourceBadge(res.type);
                      const IconComp = badge.icon;
                      return (
                        <a
                          key={rIdx}
                          href={res.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-xl transition-colors group"
                        >
                          <div className="flex items-center gap-3 truncate pr-2">
                            <div className={`p-1.5 rounded-lg border text-xs ${badge.bg}`}>
                              <IconComp className="h-4 w-4" />
                            </div>
                            <span className="text-xs font-bold text-[#111111] dark:text-gray-200 truncate group-hover:text-blue-500 transition-colors">
                              {res.title}
                            </span>
                          </div>
                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hands-on Mini Project */}
              {selectedNode.miniProject && (
                <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/40 rounded-xl space-y-1.5">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider">
                    <Code2 className="h-4 w-4" />
                    Hands-on Practical Mini-Project
                  </div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {selectedNode.miniProject}
                  </p>
                </div>
              )}

              {/* AI Strategic Practice Tips */}
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  AI Interview Practice Strategy
                </div>
                <p className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                  {selectedNode.aiTips}
                </p>
              </div>
            </div>

            {/* Persistent Completion Action Button */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() =>
                  handleToggleNodeCompletion(
                    selectedNode._id || selectedNode.week,
                    !selectedNode.completed
                  )
                }
                disabled={togglingNodeId === (selectedNode._id || selectedNode.week)}
                className={`w-full py-3 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 ${
                  selectedNode.completed
                    ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {togglingNodeId === (selectedNode._id || selectedNode.week) ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : selectedNode.completed ? (
                  <>
                    <RotateCcw className="h-4 w-4" />
                    Mark Node as Incomplete
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Mark Node as Completed
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
