import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Eye, Sparkles, Video, Map, ArrowRight, CheckCircle2, GitCommit } from 'lucide-react';

export default function RoadmapProgress({ recentReports, roadmapProgress }) {
  const navigate = useNavigate();

  const resumeRep = recentReports?.latestResumeAnalysis;
  const evalRep = recentReports?.latestInterviewEvaluation;

  return (
    <div className="space-y-6">
      {/* AI Career Roadmap Progress Widget */}
      <div className="p-5 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs text-left transition-colors theme-transition space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2 text-blue-500">
            <Map className="h-4.5 w-4.5" />
            <h3 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
              AI Career Roadmap Progress
            </h3>
          </div>
          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
            {roadmapProgress?.hasRoadmap ? 'Active Learning Path' : 'Not Generated'}
          </span>
        </div>

        {roadmapProgress?.hasRoadmap ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700/60">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Target Role Goal
                </span>
                <h4 className="text-sm font-bold text-[#111111] dark:text-white">
                  {roadmapProgress.careerGoal}
                </h4>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 block">
                    Completed Nodes
                  </span>
                  <span className="text-sm font-black text-emerald-500">
                    {roadmapProgress.completedNodes} / {roadmapProgress.totalNodes}
                  </span>
                </div>
                <button
                  onClick={() => navigate('/career-roadmap')}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue Path</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Progress Bar & Next Active Node */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-gray-700 dark:text-gray-300">
                  Career Readiness & Roadmap Progress
                </span>
                <span className="font-black text-blue-500">
                  {roadmapProgress.progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${roadmapProgress.progressPercent}%` }}
                />
              </div>

              {roadmapProgress.nextActiveNode && (
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 pt-1">
                  <GitCommit className="h-4 w-4 text-blue-500 flex-shrink-0 animate-pulse" />
                  <span className="font-semibold text-gray-400">Next Focus:</span>
                  <span className="font-bold text-[#111111] dark:text-white truncate">
                    Week {roadmapProgress.nextActiveNode.week}: {roadmapProgress.nextActiveNode.title}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl text-center space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Generate your personalized AI Career Roadmap to track your weekly learning milestones and visual path.
            </p>
            <button
              onClick={() => navigate('/career-roadmap')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Career Roadmap</span>
            </button>
          </div>
        )}
      </div>

      {/* Recent AI Reports Box */}
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
    </div>
  );
}
