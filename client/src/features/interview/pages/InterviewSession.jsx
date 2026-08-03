import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Building2,
  Briefcase,
} from 'lucide-react';

import SessionProgressBar from '../components/SessionProgressBar';
import SessionTimer       from '../components/SessionTimer';
import QuestionCard       from '../components/QuestionCard';
import SessionSidebar     from '../components/SessionSidebar';
import { MOCK_QUESTIONS, DEFAULT_SESSION } from '../data/questions';

// ─── Distraction-free top bar ────────────────────────────────────────────────
function SessionTopBar({ session, currentIndex, total }) {
  return (
    <header className="shrink-0 bg-white dark:bg-[#0b0f19] border-b border-[#E5E7EB] dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Brand + session meta */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex flex-col leading-tight min-w-0">
          <div className="flex items-center gap-2 text-[#60A5FA]">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest truncate">
              {session.company}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-semibold truncate">{session.role}</span>
          </div>
        </div>
      </div>

      {/* Centre: question number pill */}
      <div className="flex flex-col items-center shrink-0">
        <span className="text-xs font-extrabold text-[#111111] dark:text-white tabular-nums">
          {currentIndex + 1}
          <span className="font-normal text-gray-400 dark:text-gray-500"> / {total}</span>
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
          Question
        </span>
      </div>

      {/* Right: live timer */}
      <div className="flex items-center gap-3">
        <SessionTimer
          totalSeconds={session.estimatedMins * 60}
          onExpire={() => toast.error('Time is up! Submitting your session.')}
        />
      </div>
    </header>
  );
}

// ─── Answer textarea ─────────────────────────────────────────────────────────
function AnswerTextArea({ value, onChange, questionId }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Your Answer
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 tabular-nums">
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </span>
      </div>
      <textarea
        key={questionId}           /* remounts on question change to reset scroll */
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type your answer here. Be clear, structured, and concise..."
        rows={9}
        className="w-full px-5 py-4 bg-transparent text-sm font-medium text-[#111111] dark:text-white placeholder-gray-300 dark:placeholder-gray-600 resize-none focus:outline-none leading-relaxed"
        aria-label="Answer text area"
      />
    </div>
  );
}

// ─── Bottom navigation bar ───────────────────────────────────────────────────
function SessionNav({ currentIndex, total, answers, questions, onPrev, onNext, onSubmit }) {
  const answeredCount = questions.filter(q => answers[q.id]?.trim()).length;
  const isFirst = currentIndex === 0;
  const isLast  = currentIndex === total - 1;

  return (
    <footer className="shrink-0 bg-white dark:bg-[#0b0f19] border-t border-[#E5E7EB] dark:border-gray-800 px-4 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-500 dark:text-gray-400 font-bold text-xs rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Mobile answered counter */}
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide lg:hidden">
          {answeredCount}/{total} Done
        </span>

        {/* Next / Submit */}
        {isLast ? (
          <button
            id="submit-interview-btn"
            onClick={onSubmit}
            className="inline-flex items-center gap-2 h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Send className="h-4 w-4" />
            Submit Interview
          </button>
        ) : (
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewSession() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // Accept real session data forwarded from Instructions page; fall back to DEFAULT_SESSION.
  const session   = location.state?.session ?? DEFAULT_SESSION;
  const questions = location.state?.questions ?? MOCK_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  // answers: { [questionId]: string }
  const [answers, setAnswers] = useState({});

  const currentQ = questions[currentIndex];

  const handleAnswerChange = useCallback((text) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: text }));
  }, [currentQ.id]);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (!answers[currentQ.id]?.trim()) {
      toast('Tip: try to answer every question for better AI feedback.', { icon: '💡' });
    }
    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  const handleJump = (idx) => {
    setCurrentIndex(idx);
  };

  const handleSubmit = () => {
    const answeredCount = questions.filter(q => answers[q.id]?.trim()).length;
    const unanswered    = questions.length - answeredCount;

    if (unanswered > 0) {
      toast(
        `You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Submitting anyway…`,
        { icon: '⚠️', duration: 3000 }
      );
    } else {
      toast.success('Interview submitted! Generating your AI feedback…');
    }

    // Navigate to the Feedback page
    setTimeout(() => navigate('/ai-interviews/feedback'), 1500);
  };

  return (
    /*
     * Distraction-free full-screen layout:
     * No sidebar, no global TopNavbar — just the interview chrome.
     */
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">

      {/* ── Thin progress strip ─────────────────────────────────────────────── */}
      <SessionProgressBar current={currentIndex + 1} total={questions.length} />

      {/* ── Top bar (company, question #, timer) ─────────────────────────── */}
      <SessionTopBar
        session={session}
        currentIndex={currentIndex}
        total={questions.length}
      />

      {/* ── Scrollable content + sidebar ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Main content column */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">

            {/* Question card */}
            <QuestionCard
              questionNumber={currentIndex + 1}
              total={questions.length}
              type={currentQ.type}
              question={currentQ.question}
            />

            {/* Answer area */}
            <AnswerTextArea
              key={currentQ.id}
              value={answers[currentQ.id] ?? ''}
              onChange={handleAnswerChange}
              questionId={currentQ.id}
            />

            {/* Mobile session stats strip (visible only on small screens) */}
            <div className="flex items-center justify-between lg:hidden bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl px-4 py-3 shadow-xs">
              <div className="text-center">
                <div className="text-base font-extrabold text-emerald-500">
                  {questions.filter(q => answers[q.id]?.trim()).length}
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Answered</div>
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
              <div className="text-center">
                <div className="text-base font-extrabold text-[#111111] dark:text-white">
                  {questions.length - questions.filter(q => answers[q.id]?.trim()).length}
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Remaining</div>
              </div>
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
              <div className="text-center">
                <div className="text-base font-extrabold text-[#111111] dark:text-white">
                  ~{session.estimatedMins}m
                </div>
                <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Est. Time</div>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="shrink-0 w-72 xl:w-80 overflow-y-auto p-4 pr-6 hidden lg:block">
          <SessionSidebar
            questions={questions}
            answers={answers}
            currentIndex={currentIndex}
            estimatedMins={session.estimatedMins}
            onJump={handleJump}
          />
        </div>

      </div>

      {/* ── Bottom nav (Prev / Next / Submit) ────────────────────────────── */}
      <SessionNav
        currentIndex={currentIndex}
        total={questions.length}
        answers={answers}
        questions={questions}
        onPrev={handlePrev}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />

    </div>
  );
}
