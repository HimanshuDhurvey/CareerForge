import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  FileText, Upload, Trash2, Eye, X, Sparkles, CheckCircle2,
  AlertCircle, Loader2, Target, Zap, Lightbulb, Tag, Shield,
  CloudUpload, Download, Clock, Award, Lock, ExternalLink,
  ChevronRight, AlertTriangle, Check, BookOpen, Layers, BarChart3,
  History, ArrowUpRight, CheckCircle, Code2, ArrowUp, ArrowDown, Minus, Sliders,
  Search, Filter, Calendar, TrendingUp, Trophy, RefreshCw, ChevronLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { resumeService } from '../../../services/resumeService';

// ─── Score Color Helpers (5 Color Tiers) ──────────────────────────────────────
function getScoreColor(score) {
  if (score >= 90) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-500 dark:border-emerald-600',
      stroke: '#10B981',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
      barBg: 'bg-emerald-500',
      dot: '🟢',
      label: 'Excellent',
    };
  } else if (score >= 80) {
    return {
      text: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      border: 'border-blue-500 dark:border-blue-600',
      stroke: '#3B82F6',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      barBg: 'bg-blue-500',
      dot: '🔵',
      label: 'Good',
    };
  } else if (score >= 70) {
    return {
      text: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-500 dark:border-amber-600',
      stroke: '#F59E0B',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      barBg: 'bg-amber-500',
      dot: '🟡',
      label: 'Average',
    };
  } else if (score >= 50) {
    return {
      text: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      border: 'border-orange-500 dark:border-orange-600',
      stroke: '#F97316',
      badge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
      barBg: 'bg-orange-500',
      dot: '🟠',
      label: 'Weak',
    };
  } else {
    return {
      text: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/30',
      border: 'border-red-500 dark:border-red-600',
      stroke: '#EF4444',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
      barBg: 'bg-red-500',
      dot: '🔴',
      label: 'Poor',
    };
  }
}

// ─── Circular Score Card Component ─────────────────────────────────────────
function CircularScoreCard({ title, score, subtitle, icon: Icon }) {
  const colors = getScoreColor(score);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - (score || 0) / 100);

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col items-center text-center space-y-3 relative overflow-hidden">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Icon className="h-4 w-4" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest">{title}</span>
        </div>
        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${colors.badge}`}>
          {colors.label}
        </span>
      </div>

      <div className="relative w-28 h-28 flex items-center justify-center my-1">
        <svg width="110" height="110" className="-rotate-90">
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-gray-100 dark:text-gray-800"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-extrabold tabular-nums ${colors.text}`}>
            {score}
            <span className="text-xs font-bold text-gray-400">%</span>
          </span>
        </div>
      </div>

      <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500">{subtitle}</p>
    </div>
  );
}

// ─── Score Progress Bar Component ──────────────────────────────────────────
function ScoreProgressBar({ label, score, icon: Icon }) {
  const colors = getScoreColor(score);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1.5 text-[#111111] dark:text-white">
          <Icon className="h-3.5 w-3.5 text-gray-400" />
          {label}
        </span>
        <span className={`tabular-nums font-extrabold ${colors.text}`}>{score}%</span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${colors.barBg}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}

// ─── Upload Zone Component ──────────────────────────────────────────────────
function UploadZone({ onUpload, isUploading, uploadProgress }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Invalid file format. Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5 MB. Please select a smaller file.');
      return;
    }
    onUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !isUploading && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 shadow-md scale-[0.99]'
          : 'border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-950/10'
      } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => processFile(e.target.files?.[0])}
      />
      <div
        className={`p-4 rounded-2xl transition-transform ${
          isDragging
            ? 'bg-blue-100 dark:bg-blue-900/40 scale-110'
            : 'bg-blue-50 dark:bg-blue-950/30'
        }`}
      >
        <CloudUpload className={`h-10 w-10 ${isDragging ? 'text-blue-600' : 'text-blue-500'}`} />
      </div>

      {isUploading ? (
        <div className="text-center space-y-3 w-full max-w-xs">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Uploading Resume… {uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center space-y-1">
          <p className="text-sm font-extrabold text-gray-800 dark:text-gray-200">
            {isDragging ? 'Drop your PDF file here' : 'Click to Upload or Drag & Drop'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            PDF format only · Maximum file size 5 MB
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Resume Analyzer Page ──────────────────────────────────────────────
export default function ResumePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareItem, setCompareItem] = useState(null);

  // Search & Filters state for History Tracker
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 6;

  const replaceInputRef = useRef(null);

  // ── Fetch user resume & analysis history ────────────────────────────────────
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [resData, latestData, historyData] = await Promise.all([
        resumeService.getResume().catch(() => null),
        resumeService.getLatestAnalysis().catch(() => null),
        resumeService.getAnalysisHistory().catch(() => []),
      ]);

      setResume(resData);
      setActiveAnalysis(latestData || resData?.analysisResult || null);
      setAnalysisHistory(historyData || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch resume information.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Upload handler ────────────────────────────────────────────────────────
  const handleUpload = async (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Invalid file format. Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5 MB. Please select a smaller file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    try {
      const uploaded = await resumeService.uploadResume(file, setUploadProgress);
      setResume(uploaded);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  // ── Delete overall resume handler ─────────────────────────────────────────
  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await resumeService.deleteResume();
      setResume(null);
      setActiveAnalysis(null);
      setAnalysisHistory([]);
      toast.success('Resume deleted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Delete single analysis record handler ────────────────────────────────
  const handleDeleteAnalysisRecord = async (analysisId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this historical analysis report?')) {
      return;
    }
    try {
      await resumeService.deleteAnalysisRecord(analysisId);
      toast.success('Analysis report deleted.');
      const updatedHistory = analysisHistory.filter((item) => item._id !== analysisId);
      setAnalysisHistory(updatedHistory);

      if (activeAnalysis?._id === analysisId) {
        setActiveAnalysis(updatedHistory[0] || null);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete analysis report.');
    }
  };

  // ── Delete ALL analysis records handler ───────────────────────────────────
  const handleDeleteAllAnalysisRecords = async () => {
    if (!window.confirm('Are you sure you want to delete ALL historical resume analysis reports? This action cannot be undone.')) {
      return;
    }
    try {
      await resumeService.deleteAllAnalysisRecords();
      setAnalysisHistory([]);
      setActiveAnalysis(null);
      toast.success('All historical resume analysis reports deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete all analysis reports.');
    }
  };

  // ── Gemini AI Analysis trigger ──────────────────────────────────────────
  const handleAnalyze = async () => {
    setIsAnalysing(true);
    try {
      toast.loading('Analyzing resume with Gemini AI...', { id: 'resume-toast' });
      const newAnalysis = await resumeService.analyzeResume();
      setActiveAnalysis(newAnalysis);
      toast.success('AI Resume analysis complete!', { id: 'resume-toast' });

      // Refresh history list
      const updatedHistory = await resumeService.getAnalysisHistory().catch(() => []);
      setAnalysisHistory(updatedHistory);
    } catch (err) {
      toast.error(err.message || 'AI analysis failed. Please verify PDF text content.', {
        id: 'resume-toast',
      });
    } finally {
      setIsAnalysing(false);
    }
  };

  // ── Comparison trigger ───────────────────────────────────────────────────
  const handleCompare = (item, e) => {
    if (e) e.stopPropagation();
    setCompareItem(item);
    setCompareModalOpen(true);
  };

  // ── Resume Analytics Aggregation ──────────────────────────────────────────
  const analytics = useMemo(() => {
    if (!analysisHistory || analysisHistory.length === 0) {
      return { total: 0, bestScore: 0, avgScore: 0, latestDate: null };
    }

    const scores = analysisHistory.map((item) => item.overallScore || 0);
    const bestScore = Math.max(...scores);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const latestDate = analysisHistory[0]?.createdAt
      ? new Date(analysisHistory[0].createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null;

    return { total: analysisHistory.length, bestScore, avgScore, latestDate };
  }, [analysisHistory]);

  // ── Filter & Search Logic for History ────────────────────────────────────
  const filteredHistory = useMemo(() => {
    return analysisHistory
      .filter((item) => {
        // Grade filter
        const score = item.overallScore || 0;
        if (gradeFilter === 'excellent' && score < 90) return false;
        if (gradeFilter === 'good' && (score < 80 || score >= 90)) return false;
        if (gradeFilter === 'average' && (score < 70 || score >= 80)) return false;
        if (gradeFilter === 'poor' && score >= 70) return false;

        // Search query filter (matches filename, date, or score)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = (resume?.originalName || '').toLowerCase().includes(q);
          const scoreMatch = (item.overallScore || '').toString().includes(q);
          const dateMatch = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString().toLowerCase().includes(q)
            : false;
          return nameMatch || scoreMatch || dateMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortOrder === 'highest') return (b.overallScore || 0) - (a.overallScore || 0);
        if (sortOrder === 'lowest') return (a.overallScore || 0) - (b.overallScore || 0);
        return 0;
      });
  }, [analysisHistory, gradeFilter, sortOrder, searchQuery, resume]);

  // Paginated History Cards
  const totalPages = Math.ceil(filteredHistory.length / CARDS_PER_PAGE) || 1;
  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * CARDS_PER_PAGE;
    return filteredHistory.slice(start, start + CARDS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  const fileUrl = resume ? resumeService.getFileUrl(resume.filename) : '';

  // Extract active analysis fields cleanly
  const report = activeAnalysis || {};
  const overallScore = report.overallScore ?? 0;
  const atsScore = report.atsScore ?? 0;
  const formattingScore = report.formattingScore ?? 0;
  const contentScore = report.contentScore ?? 0;
  const skillsScore = report.skillsScore ?? 0;
  const projectsScore = report.projectsScore ?? 0;
  const experienceScore = report.experienceScore ?? 0;
  const educationScore = report.educationScore ?? 0;
  const grammarScore = report.grammarScore ?? 0;

  const strengths = report.strengths || [];
  const weaknesses = report.weaknesses || [];
  const missingKeywords = report.missingKeywords || [];
  const recommendedSkills = report.recommendedSkills || [];
  const recommendedProjects = report.recommendedProjects || [];
  const atsIssues = report.atsIssues || [];
  const improvementSuggestions = report.improvementSuggestions || report.suggestions || [];
  const summaryText = report.summary || '';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full text-left">
          {/* ── TOP HEADER ───────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-purple-500 mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">
                    Gemini AI Powered
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  AI Resume Progress Tracker
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-semibold">
                  Get instant ATS compatibility ratings, keyword optimization, and recruiter feedback.
                </p>
              </div>

              {resume && (
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalysing}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isAnalysing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>{isAnalysing ? 'Analyzing...' : 'Analyze Resume'}</span>
                  </button>

                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    id="header-replace-input"
                    onChange={(e) => handleUpload(e.target.files?.[0])}
                  />
                  <label
                    htmlFor="header-replace-input"
                    className={`flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-500 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isUploading ? 'opacity-70 pointer-events-none' : ''
                    }`}
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploading ? `Uploading ${uploadProgress}%…` : 'Replace PDF'}</span>
                  </label>

                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                    <span>View PDF</span>
                  </button>

                  <a
                    href={fileUrl}
                    download={resume.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={handleDeleteResume}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── LOADING SPINNER ──────────────────────────────────────────── */}
          {isLoading && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-12 shadow-xs flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                Loading resume & AI analysis records…
              </p>
            </div>
          )}

          {/* ── RESUME UPLOAD SECTION ───────────────────────────────────── */}
          {!isLoading && !resume && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
                  Upload Resume
                </h2>
              </div>
              <UploadZone
                onUpload={handleUpload}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
              />
            </div>
          )}

          {/* ── MAIN ANALYSIS REPORT DISPLAY ───────────────────────────── */}
          {!isLoading && resume && (
            <div className="space-y-6">
              {/* Active File Meta Card */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl shrink-0">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white truncate max-w-xs sm:max-w-md">
                        {resume.originalName}
                      </h3>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
                      {resumeService.formatFileSize(resume.fileSize)} · Uploaded{' '}
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <a
                    href={fileUrl}
                    download={resume.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 h-10 px-4 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center gap-1.5 h-10 px-4 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                    <span>View PDF</span>
                  </button>

                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalysing}
                    className="inline-flex items-center gap-2 h-10 px-5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isAnalysing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    <span>
                      {isAnalysing
                        ? 'Analyzing with Gemini...'
                        : activeAnalysis
                        ? 'Re-Run AI Analysis'
                        : 'Analyze Resume'}
                    </span>
                  </button>
                </div>
              </div>

              {/* ── SCORE VISUALIZATIONS SECTION ───────────────────────── */}
              {activeAnalysis && (
                <>
                  {/* Executive Summary Callout */}
                  {summaryText && (
                    <div className="p-5 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-purple-500">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-extrabold uppercase tracking-wide">
                          Executive Resume Summary
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 leading-relaxed">
                        {summaryText}
                      </p>
                    </div>
                  )}

                  {/* Circular Score Cards (Overall & ATS) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <CircularScoreCard
                      title="Overall Quality"
                      score={overallScore}
                      subtitle="Holistic quality rating across impact & keywords"
                      icon={Award}
                    />
                    <CircularScoreCard
                      title="ATS Compatibility"
                      score={atsScore}
                      subtitle="Pass rate through automated recruiter ATS screeners"
                      icon={Target}
                    />

                    {/* Sub-scores Progress Bars List (spanning 2 cols on lg) */}
                    <div className="sm:col-span-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2.5">
                        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          Detailed Score Breakdown
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-1">
                        <ScoreProgressBar label="Formatting & Layout" score={formattingScore} icon={Layers} />
                        <ScoreProgressBar label="Content Impact" score={contentScore} icon={FileText} />
                        <ScoreProgressBar label="Technical Skills" score={skillsScore} icon={Zap} />
                        <ScoreProgressBar label="Projects Portfolio" score={projectsScore} icon={Code2} />
                        <ScoreProgressBar label="Experience Alignment" score={experienceScore} icon={Clock} />
                        <ScoreProgressBar label="Grammar & Syntax" score={grammarScore} icon={Check} />
                      </div>
                    </div>
                  </div>

                  {/* ── REPORT CARDS GRID ───────────────────────────────────── */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left Column (6 cols): Strengths, Missing Keywords, Recommended Projects */}
                    <div className="lg:col-span-6 space-y-6">
                      {/* Strengths Card */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-emerald-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            Key Resume Strengths
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {strengths.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                              <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 mt-0.5 shrink-0">
                                <Check className="h-3 w-3" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Missing Keywords Card */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-purple-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <Tag className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            Missing Industry Keywords
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {missingKeywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-xl border border-purple-100 dark:border-purple-900/50"
                            >
                              + {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Portfolio Projects */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-blue-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <Code2 className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            Recommended Projects to Add
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {recommendedProjects.map((proj, idx) => (
                            <li
                              key={idx}
                              className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-start gap-2.5"
                            >
                              <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                              <span>{proj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column (6 cols): Weaknesses, ATS Issues, Improvement Suggestions */}
                    <div className="lg:col-span-6 space-y-6">
                      {/* Weaknesses Card */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <AlertTriangle className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            Areas to Improve
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {weaknesses.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                              <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-500 mt-0.5 shrink-0">
                                <AlertCircle className="h-3 w-3" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* ATS Issues Card */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-red-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <Shield className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            ATS Parser Warnings
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {atsIssues.map((issue, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
                              <span className="p-1 rounded-md bg-red-50 dark:bg-red-950/40 text-red-500 mt-0.5 shrink-0">
                                <X className="h-3 w-3" />
                              </span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actionable Improvement Suggestions */}
                      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 text-purple-500 border-b border-gray-100 dark:border-gray-800 pb-3">
                          <Lightbulb className="h-4.5 w-4.5" />
                          <h3 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                            Actionable Improvement Steps
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {improvementSuggestions.map((sug, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="shrink-0 w-5 h-5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-500 flex items-center justify-center text-[10px] font-extrabold mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed">
                                {sug}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── RESUME PROGRESS TRACKER & HISTORY SECTION ──────────────────────── */}
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-xs space-y-6">
                {/* 1. TOP RESUME ANALYTICS METRICS BAR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-500">
                      <TrendingUp className="h-5 w-5" />
                      <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                        Resume Analytics & Progress Tracker
                      </h2>
                    </div>
                    <p className="text-xs text-gray-400 font-semibold">
                      Track score gains, ATS progression, and recruiter recommendations across versions.
                    </p>
                  </div>

                  {/* 4 Metrics Summary Grid + Clear All History Button */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Total Analyses</span>
                        <span className="text-lg font-extrabold text-blue-500 tabular-nums">{analytics.total}</span>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Best Score</span>
                        <span className="text-lg font-extrabold text-emerald-500 tabular-nums">{analytics.bestScore}%</span>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Average Score</span>
                        <span className="text-lg font-extrabold text-purple-500 tabular-nums">{analytics.avgScore}%</span>
                      </div>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Latest Date</span>
                        <span className="text-xs font-extrabold text-gray-700 dark:text-gray-200 mt-1 block truncate max-w-[90px] mx-auto">
                          {analytics.latestDate || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {analysisHistory.length > 0 && (
                      <button
                        onClick={handleDeleteAllAnalysisRecords}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-extrabold transition-colors cursor-pointer border border-red-200 dark:border-red-900/50"
                        title="Delete all historical analysis reports at once"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete All Reports</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. SEARCH & FILTER CONTROLS */}
                {analysisHistory.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-gray-50/50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                    {/* Search bar */}
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by resume name, score, or date..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto shrink-0 pt-2 sm:pt-0">
                      <div className="flex items-center gap-1">
                        <Filter className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Grade:</span>
                      </div>
                      {[
                        { id: 'all', label: 'All' },
                        { id: 'excellent', label: '90+ Excellent' },
                        { id: 'good', label: '80-89 Good' },
                        { id: 'average', label: '70-79 Average' },
                        { id: 'poor', label: '<70 Poor' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => { setGradeFilter(tab.id); setCurrentPage(1); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                            gradeFilter === tab.id
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}

                      {/* Sort dropdown */}
                      <select
                        value={sortOrder}
                        onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                        className="px-2.5 py-1 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-[11px] font-bold rounded-lg focus:outline-none cursor-pointer"
                      >
                        <option value="latest">Sort: Latest</option>
                        <option value="oldest">Sort: Oldest</option>
                        <option value="highest">Sort: Highest Score</option>
                        <option value="lowest">Sort: Lowest Score</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. EMPTY STATE IF NO HISTORY / MATCHES */}
                {filteredHistory.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3 text-center">
                    <History className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <h4 className="text-sm font-extrabold text-gray-700 dark:text-gray-300">
                      No previous resume analyses available.
                    </h4>
                    <p className="text-xs text-gray-400 max-w-sm">
                      Upload your PDF resume above and click Analyze Resume to generate your first ATS evaluation report.
                    </p>
                    {resume && (
                      <button
                        onClick={handleAnalyze}
                        disabled={isAnalysing}
                        className="inline-flex items-center gap-2 h-9 px-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs cursor-pointer mt-1"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Analyze Resume Now</span>
                      </button>
                    )}
                  </div>
                ) : (
                  /* 4. HISTORY CARDS GRID */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {paginatedHistory.map((item) => {
                        const colors = getScoreColor(item.overallScore || 0);
                        const isCurrent = activeAnalysis?._id === item._id || activeAnalysis?.id === item.id;
                        
                        // Original index in full history list for version numbering
                        const origIndex = analysisHistory.findIndex((h) => h._id === item._id);
                        const versionNum = origIndex !== -1 ? analysisHistory.length - origIndex : 1;
                        const formattedDate = item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'Recent Analysis';

                        // Compare score with previous analysis (older report at origIndex + 1)
                        const prevItem = origIndex !== -1 ? analysisHistory[origIndex + 1] : null;
                        const overallDiff = prevItem ? (item.overallScore || 0) - (prevItem.overallScore || 0) : null;
                        const atsDiff = prevItem ? (item.atsScore || 0) - (prevItem.atsScore || 0) : null;
                        const projectsDiff = prevItem ? (item.projectsScore || 0) - (prevItem.projectsScore || 0) : null;
                        const skillsDiff = prevItem ? (item.skillsScore || 0) - (prevItem.skillsScore || 0) : null;

                        return (
                          <div
                            key={item._id}
                            className={`p-5 rounded-2xl border-2 transition-all space-y-3.5 flex flex-col justify-between ${colors.border} ${
                              isCurrent
                                ? 'bg-blue-50/40 dark:bg-blue-950/20 shadow-md ring-2 ring-blue-500/50'
                                : 'bg-white dark:bg-[#111827] hover:shadow-xs'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Header: File Name + Date + Version */}
                              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/80 pb-2.5">
                                <div className="flex items-center gap-2 min-w-0">
                                  <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                  <span className="text-xs font-extrabold text-[#111111] dark:text-white truncate max-w-[140px]" title={item.originalName || item.resume?.originalName || `Resume_v${versionNum}.pdf`}>
                                    {item.originalName || item.resume?.originalName || `Resume_v${versionNum}.pdf`}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0">
                                  {formattedDate} • <span className="font-extrabold text-blue-500">Version {versionNum}</span>
                                </span>
                              </div>

                              {/* Overall Score Badge */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-base">{colors.dot}</span>
                                  <span className={`text-base font-extrabold tabular-nums ${colors.text}`}>
                                    Overall {item.overallScore}%
                                  </span>
                                </div>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${colors.badge}`}>
                                  {colors.label}
                                </span>
                              </div>

                              {/* Sub-Scores Row */}
                              <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 px-3 py-2 rounded-xl border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <span>ATS {item.atsScore}%</span>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span>Skills {item.skillsScore}%</span>
                                <span className="text-gray-300 dark:text-gray-600">|</span>
                                <span>Projects {item.projectsScore}%</span>
                              </div>

                              {/* Small Unique AI Summary (2-3 lines) */}
                              <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 italic bg-gray-50/50 dark:bg-gray-800/20 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                                "{item.summary || 'Custom recruiter evaluation report.'}"
                              </p>

                              {/* Progress Comparison Indicators (Per Metric) */}
                              {prevItem ? (
                                <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-extrabold">
                                  {/* Overall Deltas */}
                                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/40">
                                    <span className="text-gray-400">Overall:</span>
                                    <span className={overallDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                      {overallDiff >= 0 ? `▲ +${overallDiff}` : `▼ ${overallDiff}`}
                                    </span>
                                  </div>
                                  {/* ATS Deltas */}
                                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/40">
                                    <span className="text-gray-400">ATS:</span>
                                    <span className={atsDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                      {atsDiff >= 0 ? `▲ +${atsDiff}` : `▼ ${atsDiff}`}
                                    </span>
                                  </div>
                                  {/* Projects Deltas */}
                                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/40">
                                    <span className="text-gray-400">Projects:</span>
                                    <span className={projectsDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                      {projectsDiff >= 0 ? `▲ +${projectsDiff}` : `▼ ${projectsDiff}`}
                                    </span>
                                  </div>
                                  {/* Skills Deltas */}
                                  <div className="flex items-center justify-between px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800/40">
                                    <span className="text-gray-400">Skills:</span>
                                    <span className={skillsDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                                      {skillsDiff >= 0 ? `▲ +${skillsDiff}` : `▼ ${skillsDiff}`}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold text-gray-400 italic pt-1">
                                  Initial Baseline Report (Version 1)
                                </div>
                              )}
                            </div>

                            {/* Card Actions: View Report, Compare, Delete */}
                            <div className="flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
                              <button
                                onClick={() => setActiveAnalysis(item)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                                  isCurrent
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                <span>{isCurrent ? 'Viewing' : 'View Report'}</span>
                              </button>

                              {prevItem && (
                                <button
                                  onClick={(e) => handleCompare(item, e)}
                                  className="flex items-center justify-center gap-1.5 py-2 px-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                                >
                                  <Sliders className="h-3.5 w-3.5 text-blue-500" />
                                  <span>Compare</span>
                                </button>
                              )}

                              <button
                                onClick={(e) => handleDeleteAnalysisRecord(item._id, e)}
                                className="p-2 border border-red-100 dark:border-red-950/40 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 rounded-xl transition-colors cursor-pointer"
                                title="Delete report"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 text-xs font-bold">
                        <span className="text-gray-400">
                          Page {currentPage} of {totalPages} ({filteredHistory.length} reports total)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" /> Previous
                          </button>
                          <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 cursor-pointer"
                          >
                            Next <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── ADVANCED SIDE-BY-SIDE COMPARISON MODAL ───────────────────────── */}
      {compareModalOpen && compareItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[92vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-2 text-purple-500">
                <Sliders className="h-5 w-5" />
                <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                  Side-by-Side Resume Report Comparison
                </h3>
              </div>
              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Score Deltas Header Bar */}
              {(() => {
                const origIndex = analysisHistory.findIndex((h) => h._id === compareItem._id);
                const prevItem = origIndex !== -1 ? analysisHistory[origIndex + 1] : activeAnalysis;
                const oDiff = (compareItem.overallScore || 0) - (prevItem?.overallScore || 0);
                const atsDiff = (compareItem.atsScore || 0) - (prevItem?.atsScore || 0);
                const projDiff = (compareItem.projectsScore || 0) - (prevItem?.projectsScore || 0);
                const skillDiff = (compareItem.skillsScore || 0) - (prevItem?.skillsScore || 0);

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 text-center text-xs font-extrabold">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Overall Progress</span>
                      <span className={oDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {oDiff >= 0 ? `▲ +${oDiff}%` : `▼ ${oDiff}%`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">ATS Progress</span>
                      <span className={atsDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {atsDiff >= 0 ? `▲ +${atsDiff}%` : `▼ ${atsDiff}%`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Projects Delta</span>
                      <span className={projDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {projDiff >= 0 ? `▲ +${projDiff}%` : `▼ ${projDiff}%`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase block">Skills Delta</span>
                      <span className={skillDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {skillDiff >= 0 ? `▲ +${skillDiff}%` : `▼ ${skillDiff}%`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Column 1: Selected Report */}
                <div className="p-5 bg-purple-50/30 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/40 pb-2">
                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Selected Report ({compareItem.createdAt ? new Date(compareItem.createdAt).toLocaleDateString() : 'Current'})
                    </span>
                    <span className="text-lg font-extrabold text-purple-600 tabular-nums">
                      {compareItem.overallScore}%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-400">ATS Score:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200">{compareItem.atsScore}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-400">Skills Score:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200">{compareItem.skillsScore}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-400">Projects Score:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200">{compareItem.projectsScore}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-400">Formatting Score:</span>
                      <span className="font-extrabold text-gray-800 dark:text-gray-200">{compareItem.formattingScore || 80}%</span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#111827] p-3 rounded-xl border border-purple-100 dark:border-purple-900/30">
                    "{compareItem.summary || 'Summary unavailable.'}"
                  </p>
                </div>

                {/* Column 2: Baseline / Previous Report */}
                {(() => {
                  const origIndex = analysisHistory.findIndex((h) => h._id === compareItem._id);
                  const prevItem = origIndex !== -1 && analysisHistory[origIndex + 1] ? analysisHistory[origIndex + 1] : activeAnalysis;

                  return (
                    <div className="p-5 bg-blue-50/30 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 pb-2">
                        <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Comparison Baseline ({prevItem?.createdAt ? new Date(prevItem.createdAt).toLocaleDateString() : 'Baseline'})
                        </span>
                        <span className="text-lg font-extrabold text-blue-600 tabular-nums">
                          {prevItem?.overallScore || 0}%
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-semibold">
                        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-400">ATS Score:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">{prevItem?.atsScore || 0}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-400">Skills Score:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">{prevItem?.skillsScore || 0}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-400">Projects Score:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">{prevItem?.projectsScore || 0}%</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                          <span className="text-gray-400">Formatting Score:</span>
                          <span className="font-extrabold text-gray-800 dark:text-gray-200">{prevItem?.formattingScore || 80}%</span>
                        </div>
                      </div>

                      <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-[#111827] p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        "{prevItem?.summary || 'Summary unavailable.'}"
                      </p>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PDF PREVIEW MODAL ────────────────────────────────────────────── */}
      {previewOpen && resume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden"
            style={{ height: '88vh' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <span className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide truncate">
                {resume.originalName}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open in New Tab</span>
                </a>
                <button
                  onClick={() => setPreviewOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                  aria-label="Close Preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <iframe src={fileUrl} title="Resume Preview" className="flex-1 w-full border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
