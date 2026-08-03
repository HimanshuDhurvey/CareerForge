import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Building2,
  Briefcase,
  Gauge,
  HelpCircle,
  Clock,
  TriangleAlert,
  CheckCircle2,
  Video,
} from 'lucide-react';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import { DEFAULT_SESSION } from '../data/questions';
import { INSTRUCTIONS } from '../data/interviewTypes';



// ─── Helper: difficulty badge colour ──────────────────────────────────────────
function getDifficultyStyle(level) {
  switch (level?.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400';
    case 'hard':
      return 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400';
    default:
      return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400';
  }
}

// ─── Sub-component: single summary row ────────────────────────────────────────
function SummaryRow({ icon: Icon, label, value, valueCls = '' }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
      </div>
      <span className={`text-xs font-extrabold text-[#111111] dark:text-white ${valueCls}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Sub-component: single instruction row ────────────────────────────────────
function InstructionRow({ icon: Icon, text }) {
  return (
    <li className="flex items-start gap-3">
      <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-[#60A5FA] shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 leading-relaxed">
        {text}
      </p>
    </li>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function InterviewInstructions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Allow real data to flow in via router state; fall back to DEFAULT_SESSION.
  const session = location.state?.session ?? DEFAULT_SESSION;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(p => !p)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">

            {/* ── Page header ───────────────────────────────────────────── */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/ai-interviews/setup')}
                aria-label="Go back to setup"
                className="p-2 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
              <div>
                <div className="flex items-center gap-2 text-[#60A5FA] mb-0.5">
                  <Video className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">AI Mock Interviews</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Before You Begin
                </h1>
              </div>
            </div>

            {/* ── Interview Summary card ─────────────────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                  Interview Summary
                </h2>
              </div>

              {/* Summary rows */}
              <div className="px-6 pb-2 pt-1">
                <SummaryRow
                  icon={Building2}
                  label="Company"
                  value={session.company}
                />
                <SummaryRow
                  icon={Briefcase}
                  label="Role"
                  value={session.role}
                />
                <SummaryRow
                  icon={Gauge}
                  label="Difficulty"
                  value={session.difficulty}
                  valueCls={getDifficultyStyle(session.difficulty)}
                />
                <SummaryRow
                  icon={HelpCircle}
                  label="Questions"
                  value={`${session.numQuestions} Questions`}
                />
                <SummaryRow
                  icon={Clock}
                  label="Estimated Time"
                  value={session.estimatedTime}
                />
              </div>
            </div>

            {/* ── Instructions card ──────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
              {/* Card header */}
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
                  Instructions
                </h2>
              </div>

              {/* Instruction rows */}
              <ul className="px-6 py-5 space-y-4">
                {INSTRUCTIONS.map((item, idx) => (
                  <InstructionRow key={idx} icon={item.icon} text={item.text} />
                ))}
              </ul>

              {/* Confirmation checklist */}
              <div className="px-6 pb-5">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    I have read and understood all the instructions above.
                  </span>
                </div>
              </div>
            </div>

            {/* ── Warning card ───────────────────────────────────────────── */}
            <div className="flex items-start gap-3.5 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
              <TriangleAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                  Auto-Save Active
                </p>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400/80 leading-relaxed">
                  Once started, your progress will be saved automatically after each answer. 
                  You can pause and resume anytime from the AI Interviews page.
                </p>
              </div>
            </div>

            {/* ── Action buttons ─────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-4 pb-6">
              <button
                onClick={() => navigate('/ai-interviews/setup')}
                className="inline-flex items-center gap-2 h-12 px-6 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              <button
                id="begin-interview-btn"
                onClick={() => {
                  navigate('/ai-interviews/session', {
                    state: { session },
                  });
                }}
                className="inline-flex items-center gap-2.5 h-12 px-8 bg-[#60A5FA] hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
                Begin Interview
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
