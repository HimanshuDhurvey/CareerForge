import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Upload, Trash2, Eye, X, Sparkles, CheckCircle2,
  AlertCircle, Loader2, Target, Zap, Lightbulb, Tag, Shield,
  CloudUpload, Download, Clock, Award, Lock, ArrowUpRight, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { resumeService } from '../../../services/resumeService';

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
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
      <div className={`p-4 rounded-2xl transition-transform ${isDragging ? 'bg-blue-100 dark:bg-blue-900/40 scale-110' : 'bg-blue-50 dark:bg-blue-950/30'}`}>
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

// ─── Future Feature Disabled Card ───────────────────────────────────────────
function FutureFeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="relative p-5 bg-gray-50/60 dark:bg-[#111827]/40 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex flex-col justify-between gap-4 opacity-75 grayscale-[20%] select-none">
      <div className="flex items-center justify-between">
        <div className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl">
          <Icon className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
          <Lock className="h-3 w-3" /> Coming Soon
        </span>
      </div>
      <div className="space-y-1 text-left">
        <h4 className="text-xs font-extrabold text-gray-700 dark:text-gray-300">{title}</h4>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Resume Analyzer Page ──────────────────────────────────────────────
export default function ResumePage() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [resume, setResume]             = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [isUploading, setIsUploading]   = useState(false);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [isAnalysing, setIsAnalysing]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen]   = useState(false);
  const replaceInputRef = useRef(null);

  // ── Fetch user resume on page load ─────────────────────────────────────────
  const loadResume = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.getResume();
      setResume(data);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch resume information.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResume();
  }, [loadResume]);

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

  // ── Delete handler ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    try {
      await resumeService.deleteResume();
      setResume(null);
      toast.success('Resume deleted successfully.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Optional AI Analysis trigger ─────────────────────────────────────────
  const handleAnalyze = async () => {
    setIsAnalysing(true);
    try {
      const updated = await resumeService.analyzeResume();
      setResume(updated);
      toast.success('AI Resume analysis complete!');
    } catch (err) {
      toast.error(err.message || 'AI analysis unavailable. Please verify GEMINI_API_KEY.');
    } finally {
      setIsAnalysing(false);
    }
  };

  const fileUrl  = resume ? resumeService.getFileUrl(resume.filename) : '';
  const analysis = resume?.analysisResult;
  const status   = resume?.analysisStatus;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      {/* Navigation Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full text-left">

          {/* ── TOP HEADER ───────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Resume Analyzer
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
                  Upload your resume and prepare it for AI analysis.
                </p>
              </div>

              {resume && (
                <div className="flex flex-wrap gap-2.5">
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
                    <span>{isUploading ? `Uploading ${uploadProgress}%…` : 'Replace Resume'}</span>
                  </label>

                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                    <span>View</span>
                  </button>

                  <a
                    href={fileUrl}
                    download={resume.originalName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5 text-gray-400" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
                  >
                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── LOADING SPINNER ──────────────────────────────────────────── */}
          {isLoading && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400">Loading resume details…</p>
            </div>
          )}

          {/* ── SECTION 1: RESUME UPLOAD CARD ─────────────────────────────── */}
          {!isLoading && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
                  Resume Metadata
                </h2>
                {resume && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 uppercase tracking-wider">
                    <CheckCircle2 className="h-3 w-3" /> Status: Uploaded
                  </span>
                )}
              </div>

              {!resume ? (
                /* Empty state: Upload Area */
                <UploadZone
                  onUpload={handleUpload}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />
              ) : (
                /* Resume details display */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl shrink-0">
                        <FileText className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200 truncate max-w-xs sm:max-w-md">
                            {resume.originalName}
                          </p>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        </div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                          {resumeService.formatFileSize(resume.fileSize)} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Ready for Analysis</span>
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setPreviewOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 text-gray-400" />
                      <span>View</span>
                    </button>

                    <a
                      href={fileUrl}
                      download={resume.originalName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-gray-400" />
                      <span>Download</span>
                    </a>

                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      id="card-replace-input"
                      onChange={(e) => handleUpload(e.target.files?.[0])}
                    />
                    <label
                      htmlFor="card-replace-input"
                      className={`flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-500 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isUploading ? 'opacity-70 pointer-events-none' : ''
                      }`}
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploading ? `Uploading ${uploadProgress}%…` : 'Replace'}</span>
                    </label>

                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SECTION 2: ANALYSIS STATUS CARD ──────────────────────────── */}
          {!isLoading && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
                Analysis Status
              </h2>

              {status === 'done' && analysis ? (
                /* Analysis result summary if completed */
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">AI Analysis Completed</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                        Resume score: {analysis.overallScore}% · ATS match: {analysis.atsScore}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalysing}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70 shrink-0"
                  >
                    {isAnalysing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                    <span>Re-analyse</span>
                  </button>
                </div>
              ) : (
                /* AI Analysis Pending Card */
                <div className="p-6 bg-purple-50/40 dark:bg-purple-950/10 border border-purple-100 dark:border-purple-900/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
                      <Sparkles className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="text-sm font-extrabold text-purple-950 dark:text-purple-300">
                          AI Analysis Pending
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-200/70 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 uppercase tracking-wider">
                          Ready
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium max-w-xl">
                        AI Resume Analysis will be available after Gemini integration. Once active, Gemini AI will evaluate your resume, calculate your ATS score, and extract key skill matches.
                      </p>
                    </div>
                  </div>

                  {resume && (
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalysing}
                      className="flex items-center gap-1.5 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70 shrink-0 shadow-sm"
                    >
                      {isAnalysing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      <span>{isAnalysing ? 'Analysing…' : 'Run AI Analysis'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── SECTION 3: FUTURE FEATURES (DISABLED / COMING SOON) ───────── */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">
                Upcoming AI Features
              </h2>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">
                Phase 5.4 Roadmap
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <FutureFeatureCard
                icon={Target}
                title="ATS Score"
                description="Simulates automated hiring ATS filters to calculate compatibility percentage."
              />
              <FutureFeatureCard
                icon={Award}
                title="Resume Score"
                description="Overall quality assessment based on impact, formatting, and industry benchmarks."
              />
              <FutureFeatureCard
                icon={Zap}
                title="Missing Skills"
                description="Identifies critical technical & domain skills absent from your experience."
              />
              <FutureFeatureCard
                icon={Lightbulb}
                title="Improvement Suggestions"
                description="Actionable bullet point recommendations to improve bullet impact."
              />
              <FutureFeatureCard
                icon={Tag}
                title="Keyword Match"
                description="Highlights matched and missing keywords for targeted job descriptions."
              />
            </div>
          </div>

        </main>
      </div>

      {/* ── PDF PREVIEW MODAL ────────────────────────────────────────────── */}
      {previewOpen && resume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style={{ height: '88vh' }}>
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
            <iframe
              src={fileUrl}
              title="Resume Preview"
              className="flex-1 w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
