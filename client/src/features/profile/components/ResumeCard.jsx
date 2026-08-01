import React from 'react';
import { FileText, Eye, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ResumeCard({ resume }) {
  const handleViewResume = () => {
    toast.success("Resume preview panel is simulated (UI only).");
  };

  const handleUploadResume = () => {
    toast.success("File uploader panel is simulated (UI only).");
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm text-left transition-colors theme-transition space-y-4">
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white block uppercase tracking-wide">
        Resume Profile
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50/50 dark:bg-[#111827]/55 border border-gray-100 dark:border-gray-800/80 rounded-xl">
        {/* File detail */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-xl">
            <FileText className="h-6 w-6" />
          </div>
          <div className="text-left space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-gray-850 dark:text-gray-200">
                Himanshu_Resume.pdf
              </span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 fill-emerald-50 dark:fill-none" />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide">
              Last Updated: {resume.lastUpdated}
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              Resume Score
            </span>
            <span className="text-sm font-extrabold text-blue-500 block">
              {resume.score}%
            </span>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
          <div className="text-center">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">
              ATS Match
            </span>
            <span className="text-sm font-extrabold text-emerald-500 block">
              {resume.atsScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleViewResume}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#E5E7EB] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5 text-gray-400" />
          <span>View Resume</span>
        </button>

        <button
          onClick={handleUploadResume}
          className="flex items-center gap-1.5 px-4 py-2 border border-transparent bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 text-blue-500 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Upload className="h-3.5 w-3.5 text-blue-500" />
          <span>Upload New</span>
        </button>
      </div>
    </div>
  );
}
