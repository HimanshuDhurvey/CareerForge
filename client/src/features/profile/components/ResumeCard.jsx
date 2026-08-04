import React, { useState, useRef, useEffect } from 'react';
import { FileText, Eye, Upload, Trash2, X, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { resumeService } from '../../../services/resumeService';

/**
 * ResumeCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Displays the user's current resume, supports upload/delete/preview/analysis.
 * Connected to the live backend — no mock data.
 */
export default function ResumeCard() {
  const [resume, setResume]           = useState(null);
  const [isLoading, setIsLoading]     = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting]   = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileInputRef = useRef(null);

  // ── Load resume on mount ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const data = await resumeService.getResume();
        setResume(data);
      } catch (err) {
        // Silently ignore — no resume is a valid state
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Upload handler ──────────────────────────────────────────────────────────
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.');
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
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    setIsDeleting(true);
    try {
      await resumeService.deleteResume();
      setResume(null);
      toast.success('Resume deleted.');
    } catch (err) {
      toast.error(err.message || 'Failed to delete resume.');
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Analysis handler ────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    setIsAnalysing(true);
    try {
      const updated = await resumeService.analyzeResume();
      setResume(updated);
      toast.success('AI analysis complete!');
    } catch (err) {
      toast.error(err.message || 'Analysis failed. Please ensure GEMINI_API_KEY is configured.');
    } finally {
      setIsAnalysing(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm animate-pulse h-36" />
    );
  }

  // ── Empty state — no resume ──────────────────────────────────────────────────
  if (!resume) {
    return (
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
          Resume Profile
        </h3>

        <div className="flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-center">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
            <FileText className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">No resume uploaded yet</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">PDF only · Max 5 MB</p>
          </div>

          <input
            ref={fileInputRef}
            id="resume-upload-empty"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume-upload-empty"
            className={`flex items-center gap-1.5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Uploading {uploadProgress}%…</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Resume</span>
              </>
            )}
          </label>
          {isUploading && (
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Uploaded resume state ────────────────────────────────────────────────────
  const analysis       = resume.analysisResult;
  const analysisStatus = resume.analysisStatus;
  const fileUrl        = resumeService.getFileUrl(resume.filename);

  return (
    <>
      <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
        <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
          Resume Profile
        </h3>

        {/* File detail row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="text-left space-y-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 truncate max-w-[160px]">
                  {resume.originalName}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50 dark:fill-none shrink-0" />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
                {resumeService.formatFileSize(resume.fileSize)} · Uploaded {new Date(resume.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Score badges — shown only when analysis is done */}
          {analysisStatus === 'done' && analysis && (
            <div className="flex items-center gap-6 shrink-0">
              <div className="text-center">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Resume Score</span>
                <span className="text-sm font-extrabold text-blue-500 block">{analysis.overallScore}%</span>
              </div>
              <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
              <div className="text-center">
                <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">ATS Match</span>
                <span className="text-sm font-extrabold text-emerald-500 block">{analysis.atsScore}%</span>
              </div>
            </div>
          )}

          {/* Analysis pending / analysing state */}
          {analysisStatus === 'analysing' && (
            <div className="flex items-center gap-2 text-blue-500 text-xs font-bold">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analysing…</span>
            </div>
          )}
          {analysisStatus === 'failed' && (
            <div className="flex items-center gap-2 text-red-500 text-xs font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Analysis failed</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            <span>View Resume</span>
          </button>

          <input
            ref={fileInputRef}
            id="resume-upload-replace"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="resume-upload-replace"
            className={`flex items-center gap-1.5 px-4 py-2 border border-transparent bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-500 rounded-xl text-xs font-bold transition-colors cursor-pointer ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>{uploadProgress}%</span>
              </>
            ) : (
              <>
                <Upload className="h-3.5 w-3.5" />
                <span>Upload New</span>
              </>
            )}
          </label>

          {(analysisStatus === 'pending' || analysisStatus === 'failed') && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalysing}
              className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
            >
              {isAnalysing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isAnalysing ? 'Analysing…' : 'AI Analysis'}</span>
            </button>
          )}

          {analysisStatus === 'done' && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalysing}
              className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/30 dark:hover:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
            >
              {isAnalysing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>{isAnalysing ? 'Re-analysing…' : 'Re-analyse'}</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-500 rounded-xl text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
          </button>
        </div>

        {/* Upload progress bar */}
        {isUploading && (
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden" style={{ height: '85vh' }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <span className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wide truncate">
                {resume.originalName}
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <iframe
              src={fileUrl}
              title="Resume Preview"
              className="flex-1 w-full border-0"
            />
          </div>
        </div>
      )}
    </>
  );
}
