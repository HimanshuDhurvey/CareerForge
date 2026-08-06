import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Video, Sparkles, Upload, ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export default function ContinueLearning({ resumeCard, interviewCard }) {
  const navigate = useNavigate();

  const hasResume = resumeCard?.hasResume;
  const hasInterviews = interviewCard?.hasInterviews;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      {/* ── RESUME CARD ─────────────────────────────────────────────────── */}
      <div className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-500">
              <FileText className="h-5 w-5" />
              <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                Resume Analyzer Status
              </h3>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
              hasResume
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
            }`}>
              {hasResume ? (resumeCard.latestResumeScore ? 'AI Evaluated' : 'Uploaded') : 'No Resume'}
            </span>
          </div>

          {hasResume ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                    {resumeCard.originalName}
                  </span>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    Last Updated: {resumeCard.lastUpdated ? new Date(resumeCard.lastUpdated).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 tabular-nums">
                    {resumeCard.latestResumeScore !== null ? `${resumeCard.latestResumeScore}%` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold block">Overall Quality</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  <span className="text-[10px] font-extrabold text-purple-600 dark:text-purple-400 uppercase block">ATS Screener</span>
                  <span className="text-base font-extrabold text-gray-800 dark:text-gray-200 tabular-nums">
                    {resumeCard.latestAtsScore !== null ? `${resumeCard.latestAtsScore}%` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase block">Total Reports</span>
                  <span className="text-base font-extrabold text-gray-800 dark:text-gray-200 tabular-nums">
                    {resumeCard.totalAnalyses || 0} Reports
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center space-y-2">
              <Upload className="h-8 w-8 text-amber-500 mx-auto" />
              <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                Upload your first resume.
              </p>
              <p className="text-[11px] text-gray-400">
                Get instant ATS compatibility ratings & recruiter feedback.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/resume')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
        >
          <Sparkles className="h-4 w-4" />
          <span>{hasResume ? 'View Resume Report' : 'Upload Resume'}</span>
        </button>
      </div>

      {/* ── INTERVIEW CARD ───────────────────────────────────────────────── */}
      <div className="p-6 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs space-y-5 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-500">
              <Video className="h-5 w-5" />
              <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                AI Interview Hub
              </h3>
            </div>
            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
              hasInterviews
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              {hasInterviews ? `${interviewCard.completedInterviews} Completed` : 'No Interviews'}
            </span>
          </div>

          {hasInterviews ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800">
                <div>
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                    Last Session Date
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300 font-extrabold mt-0.5">
                    {interviewCard.lastInterviewDate ? new Date(interviewCard.lastInterviewDate).toLocaleDateString() : 'Recent'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {interviewCard.averageScore !== null ? `${interviewCard.averageScore}%` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-gray-400 font-bold block">Average Score</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase block">Best Score</span>
                  <span className="text-base font-extrabold text-gray-800 dark:text-gray-200 tabular-nums">
                    {interviewCard.bestScore !== null ? `${interviewCard.bestScore}%` : 'N/A'}
                  </span>
                </div>
                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase block">Total Sessions</span>
                  <span className="text-base font-extrabold text-gray-800 dark:text-gray-200 tabular-nums">
                    {interviewCard.totalInterviews || 0} Sessions
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl text-center space-y-2">
              <Video className="h-8 w-8 text-blue-500 mx-auto" />
              <p className="text-xs font-extrabold text-gray-700 dark:text-gray-300">
                Take your first AI Interview.
              </p>
              <p className="text-[11px] text-gray-400">
                Simulate real technical interviews with real-time feedback.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/interview')}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
        >
          <Video className="h-4 w-4" />
          <span>Start Interview</span>
        </button>
      </div>
    </div>
  );
}
