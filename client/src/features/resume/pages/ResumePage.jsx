import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Upload, Trash2, Eye, X, Sparkles, CheckCircle2,
  AlertCircle, Loader2, Target, Zap, TrendingUp, TrendingDown,
  Lightbulb, Tag, Shield, RefreshCw, CloudUpload
} from 'lucide-react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { resumeService } from '../../../services/resumeService';

// ─── Score Ring ──────────────────────────────────────────────────────────────
function ScoreRing({ score, label, color }) {
  const data = [{ value: score, fill: color }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%" cy="50%" innerRadius="70%" outerRadius="100%"
            startAngle={90} endAngle={-270} data={data}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" background={{ fill: '#f3f4f6' }} cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-extrabold" style={{ color }}>{score}%</span>
        </div>
      </div>
      <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ─── Upload Zone ─────────────────────────────────────────────────────────────
function UploadZone({ onUpload, isUploading, uploadProgress }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { toast.error('Only PDF files are allowed.'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5 MB.'); return; }
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
      className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all
        ${isDragging
          ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-950/10'
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-blue-950/5'
        } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => processFile(e.target.files?.[0])}
      />
      <div className={`p-5 rounded-2xl transition-colors ${isDragging ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
        <CloudUpload className={`h-10 w-10 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
      </div>
      {isUploading ? (
        <div className="text-center space-y-3 w-full max-w-xs">
          <p className="text-sm font-bold text-blue-500">Uploading… {uploadProgress}%</p>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {isDragging ? 'Drop your PDF here' : 'Drag & drop your resume'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">or click to browse · PDF only · Max 5 MB</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function ResumePage() {
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [resume, setResume]             = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [isUploading, setIsUploading]   = useState(false);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [isAnalysing, setIsAnalysing]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen]   = useState(false);
  const replaceRef = useRef(null);

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadResume = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await resumeService.getResume();
      setResume(data);
    } catch {
      /* no resume is valid */
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadResume(); }, [loadResume]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const uploaded = await resumeService.uploadResume(file, setUploadProgress);
      setResume(uploaded);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Delete your current resume? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await resumeService.deleteResume();
      setResume(null);
      toast.success('Resume deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Analyse ───────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    setIsAnalysing(true);
    try {
      const updated = await resumeService.analyzeResume();
      setResume(updated);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Check GEMINI_API_KEY in server .env');
    } finally {
      setIsAnalysing(false);
    }
  };

  const analysis = resume?.analysisResult;
  const status   = resume?.analysisStatus;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors theme-transition">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">

          {/* ── Page header ──────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  AI Resume Analyzer
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-semibold">
                  Upload your resume, get an ATS score, and receive Gemini-powered improvement suggestions.
                </p>
              </div>
              {resume && (
                <div className="flex flex-wrap gap-3">
                  <input ref={replaceRef} type="file" accept="application/pdf" className="hidden"
                    id="replace-resume-input" onChange={(e) => handleUpload(e.target.files?.[0])} />
                  <label htmlFor="replace-resume-input"
                    className={`flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-500 rounded-xl text-xs font-bold transition-colors cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                    <Upload className="h-3.5 w-3.5" />
                    <span>{isUploading ? `Uploading ${uploadProgress}%…` : 'Replace Resume'}</span>
                  </label>

                  <button onClick={() => setPreviewOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer">
                    <Eye className="h-3.5 w-3.5 text-gray-400" />
                    <span>Preview</span>
                  </button>

                  <button onClick={handleDelete} disabled={isDeleting}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70">
                    {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Loading ──────────────────────────────────────────────────── */}
          {isLoading && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 animate-pulse h-48" />
              ))}
            </div>
          )}

          {/* ── No resume — upload zone ───────────────────────────────────── */}
          {!isLoading && !resume && (
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-6 shadow-sm">
              <UploadZone onUpload={handleUpload} isUploading={isUploading} uploadProgress={uploadProgress} />
            </div>
          )}

          {/* ── Resume uploaded ───────────────────────────────────────────── */}
          {!isLoading && resume && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Left column — 7 cols */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Current Resume Card */}
                <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                  <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">Current Resume</h2>
                  <div className="flex items-center gap-4 p-4 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-extrabold text-gray-800 dark:text-gray-200 truncate">{resume.originalName}</p>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">
                        {resumeService.formatFileSize(resume.fileSize)} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Analyse CTA */}
                  {(status === 'pending' || status === 'failed') && (
                    <div className={`flex items-start gap-4 p-4 rounded-xl border ${status === 'failed' ? 'bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900/30' : 'bg-purple-50/50 dark:bg-purple-950/10 border-purple-100 dark:border-purple-900/30'}`}>
                      {status === 'failed'
                        ? <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        : <Sparkles className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />}
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                          {status === 'failed' ? 'Analysis failed — try again' : 'Ready for AI Analysis'}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {status === 'failed'
                            ? 'Ensure GEMINI_API_KEY is set in your server .env file.'
                            : 'Get your resume scored, ATS-checked, and receive actionable improvement suggestions.'}
                        </p>
                      </div>
                      <button onClick={handleAnalyze} disabled={isAnalysing}
                        className="flex items-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70 shrink-0">
                        {isAnalysing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                        <span>{isAnalysing ? 'Analysing…' : 'Analyse Now'}</span>
                      </button>
                    </div>
                  )}

                  {status === 'analysing' && (
                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Gemini is analysing your resume…</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">This usually takes 10–20 seconds.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {status === 'done' && analysis?.suggestions?.length > 0 && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">Improvement Suggestions</h2>
                      <button onClick={handleAnalyze} disabled={isAnalysing}
                        className="flex items-center gap-1 text-purple-500 hover:text-purple-600 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50">
                        <RefreshCw className={`h-3.5 w-3.5 ${isAnalysing ? 'animate-spin' : ''}`} />
                        <span>Re-analyse</span>
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      {analysis.suggestions.map((tip, i) => (
                        <div key={i} className="flex items-start gap-3 p-3.5 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
                          <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold leading-relaxed">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Summary */}
                {status === 'done' && analysis?.summary && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-3">
                    <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">AI Summary</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">{analysis.summary}</p>
                  </div>
                )}
              </div>

              {/* Right column — 5 cols */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* Score Cards */}
                {status === 'done' && analysis && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-5">
                    <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">Score Overview</h2>
                    <div className="flex items-center justify-center gap-10">
                      <ScoreRing score={analysis.overallScore} label="Resume Score" color="#3b82f6" />
                      <ScoreRing score={analysis.atsScore} label="ATS Match" color="#10b981" />
                    </div>
                  </div>
                )}

                {/* Strengths & Weaknesses */}
                {status === 'done' && analysis && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide">Strengths & Weaknesses</h2>

                    {analysis.strengths?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Strengths
                        </p>
                        {analysis.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 bg-emerald-50/40 dark:bg-emerald-950/10 rounded-lg border border-emerald-100 dark:border-emerald-900/20">
                            <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{s}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {analysis.weaknesses?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider flex items-center gap-1 mt-2">
                          <TrendingDown className="h-3 w-3" /> Weaknesses
                        </p>
                        {analysis.weaknesses.map((w, i) => (
                          <div key={i} className="flex items-start gap-2.5 p-2.5 bg-red-50/40 dark:bg-red-950/10 rounded-lg border border-red-100 dark:border-red-900/20">
                            <AlertCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold">{w}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Keywords Panel */}
                {status === 'done' && analysis?.keywords && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide flex items-center gap-2">
                      <Tag className="h-4 w-4" /> ATS Keywords
                    </h2>

                    {analysis.keywords.matched?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Matched
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.keywords.matched.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.keywords.missing?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wider flex items-center gap-1">
                          <Zap className="h-3 w-3" /> Missing
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.keywords.missing.map((kw, i) => (
                            <span key={i} className="px-2.5 py-1 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Placeholder when analysis not yet done */}
                {status !== 'done' && !isLoading && resume && (
                  <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm">
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-2xl">
                        <Target className="h-8 w-8 text-purple-400" />
                      </div>
                      <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                        {status === 'analysing' ? 'Analysis in progress…' : 'Run AI Analysis to see your scores'}
                      </p>
                      <p className="text-[10px] text-gray-400">Score ring, keywords, strengths & weaknesses will appear here.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PDF Preview Modal */}
      {previewOpen && resume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style={{ height: '88vh' }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <span className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide truncate">
                {resume.originalName}
              </span>
              <button onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 cursor-pointer"
                aria-label="Close Preview">
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe
              src={resumeService.getFileUrl(resume.filename)}
              title="Resume Preview"
              className="flex-1 w-full border-0"
            />
          </div>
        </div>
      )}
    </div>
  );
}
