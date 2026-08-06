import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Award, Eye, ExternalLink, Sparkles, Video } from 'lucide-react';

export default function RoadmapProgress({ recentReports }) {
  const navigate = useNavigate();

  const resumeRep = recentReports?.latestResumeAnalysis;
  const evalRep = recentReports?.latestInterviewEvaluation;

  return (
    <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs text-left transition-colors theme-transition space-y-4">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
        <div className="flex items-center gap-2 text-purple-500">
          <Sparkles className="h-4.5 w-4.5" />
          <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
            Recent AI Evaluation Reports
          </h3>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
          Generated Summaries
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest Resume Analysis Report Card */}
        <div className="p-4 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-purple-500" />
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Latest Resume Report
                </span>
              </div>
              {resumeRep && (
                <span className="text-sm font-extrabold text-purple-600 tabular-nums">
                  {resumeRep.overallScore}%
                </span>
              )}
            </div>

            {resumeRep ? (
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed italic">
                "{resumeRep.summary || 'Comprehensive AI recruiter analysis generated.'}"
              </p>
            ) : (
              <p className="text-xs font-semibold text-gray-400 italic">
                No resume analysis generated yet. Upload a PDF to begin.
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/resume')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-extrabold transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{resumeRep ? 'View Resume Report' : 'Analyze Resume'}</span>
          </button>
        </div>

        {/* Latest Interview Evaluation Report Card */}
        <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-wider">
                  Latest Interview Report
                </span>
              </div>
              {evalRep && (
                <span className="text-sm font-extrabold text-blue-600 tabular-nums">
                  {evalRep.overallScore}%
                </span>
              )}
            </div>

            {evalRep ? (
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed italic">
                "{evalRep.overallFeedback || evalRep.summary || 'AI evaluation complete.'}"
              </p>
            ) : (
              <p className="text-xs font-semibold text-gray-400 italic">
                No AI interview evaluations generated yet. Complete an interview session.
              </p>
            )}
          </div>

          <button
            onClick={() => {
              if (evalRep?.interview) {
                navigate(`/interview/feedback/${evalRep.interview}`);
              } else {
                navigate('/ai-interviews/history');
              }
            }}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold transition-colors cursor-pointer"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{evalRep ? 'View Interview Report' : 'Start AI Interview'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
