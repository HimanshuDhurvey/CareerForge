import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Building2,
  Briefcase,
  Loader2,
} from 'lucide-react';

import SessionProgressBar from '../components/SessionProgressBar';
import SessionTimer from '../components/SessionTimer';
import QuestionCard from '../components/QuestionCard';
import SessionSidebar from '../components/SessionSidebar';
import { interviewService } from '../../../services/interviewService';
import { useInterview } from '../../../context/InterviewContext';

// ─── Distraction-free top bar ────────────────────────────────────────────────
function SessionTopBar({ session, currentIndex, total, remainingTime }) {
  return (
    <header className="shrink-0 bg-white dark:bg-[#0b0f19] border-b border-[#E5E7EB] dark:border-gray-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Brand + session meta */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden sm:flex flex-col leading-tight min-w-0">
          <div className="flex items-center gap-2 text-[#60A5FA]">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest truncate">
              {session.company || 'Target Company'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
            <Briefcase className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[10px] font-semibold truncate">{session.role || 'Role'}</span>
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
          totalSeconds={remainingTime || (session.estimatedMins ? session.estimatedMins * 60 : 600)}
          onExpire={() => toast.error('Session duration limit reached.')}
        />
      </div>
    </header>
  );
}

// ─── Answer textarea ─────────────────────────────────────────────────────────
function AnswerTextArea({ value, onChange, questionId, disabled }) {
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
        key={questionId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your answer here. Be clear, structured, and concise..."
        rows={9}
        disabled={disabled}
        className="w-full px-5 py-4 bg-transparent text-sm font-medium text-[#111111] dark:text-white placeholder-gray-300 dark:placeholder-gray-600 resize-none focus:outline-none leading-relaxed disabled:opacity-50"
        aria-label="Answer text area"
      />
    </div>
  );
}

// ─── Bottom navigation bar ───────────────────────────────────────────────────
function SessionNav({ currentIndex, total, submitting, onPrev, onNext, onSubmit }) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  return (
    <footer className="shrink-0 bg-white dark:bg-[#0b0f19] border-t border-[#E5E7EB] dark:border-gray-800 px-4 sm:px-6 py-4">
      <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
        {/* Previous (Disabled during live proctored interview) */}
        <button
          onClick={onPrev}
          disabled={true}
          title="Navigating backwards to submitted questions is disabled during an active interview session"
          className="inline-flex items-center gap-2 h-11 px-5 border border-[#E5E7EB] dark:border-gray-800 bg-white dark:bg-[#111827] text-gray-400 font-bold text-xs rounded-xl transition-colors opacity-40 cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        {/* Mobile answered counter */}
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide lg:hidden">
          Question {currentIndex + 1} of {total}
        </span>

        {/* Next / Submit */}
        {isLast ? (
          <button
            id="submit-interview-btn"
            onClick={onSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 h-11 px-6 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting ? 'Finishing...' : 'Submit Interview'}
          </button>
        ) : (
          <button
            onClick={onNext}
            disabled={submitting}
            className="inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {submitting ? 'Saving...' : 'Next'}
          </button>
        )}
      </div>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramId } = useParams();
  const { currentInterviewId, activeSession, clearInterviewSession } = useInterview();

  const interviewId = paramId || location.state?.interviewId || currentInterviewId;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQData, setCurrentQData] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [remainingTime, setRemainingTime] = useState(120);
  const [answerText, setAnswerText] = useState('');
  const [answersMap, setAnswersMap] = useState({});
  const [submittedQIds, setSubmittedQIds] = useState(new Set());
  const [answeredIndices, setAnsweredIndices] = useState(new Set());

  // Session metadata for header/sidebar
  const session = location.state?.session || activeSession || {
    company: 'Target Company',
    role: currentQData?.role || 'Developer',
    estimatedMins: 15,
  };

  // Load current question from backend
  const loadQuestionData = useCallback(async () => {
    if (!interviewId) {
      toast.error('No active interview session ID found');
      navigate('/ai-interviews/setup');
      return;
    }

    setLoading(true);
    try {
      const data = await interviewService.getCurrentQuestion(interviewId);

      if (data.isFinished) {
        toast.success('Interview Finished.');
        await interviewService.finishInterview(interviewId);
        clearInterviewSession();
        navigate(`/ai-interviews/details/${interviewId}`);
        return;
      }

      setCurrentQData(data.currentQuestion);
      const qNum = data.questionNumber || 1;
      setQuestionNumber(qNum);
      setTotalQuestions(data.totalQuestions || 10);
      setRemainingTime(data.remainingTime || 120);

      // Restore answer if previously typed/saved
      const qId = data.currentQuestion.id;
      if (answersMap[qId]) {
        setAnswerText(answersMap[qId]);
      } else {
        setAnswerText('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch current question');
    } finally {
      setLoading(false);
    }
  }, [interviewId, navigate, answersMap, clearInterviewSession]);

  useEffect(() => {
    loadQuestionData();
  }, [interviewId]);

  const handleAnswerChange = useCallback((text) => {
    setAnswerText(text);
    if (currentQData?.id) {
      setAnswersMap((prev) => ({ ...prev, [currentQData.id]: text }));
    }
  }, [currentQData]);

  // Submit answer for current question and advance
  const handleNext = async () => {
    if (!currentQData) return;

    setSubmitting(true);
    try {
      const qId = currentQData.id;
      const currentIdx = questionNumber - 1;
      const hasAnswer = Boolean(answerText && answerText.trim());

      // 1. Submit answer if typed and not already submitted
      if (hasAnswer) {
        if (!submittedQIds.has(qId)) {
          await interviewService.submitAnswer(interviewId, {
            questionId: qId,
            answer: answerText.trim(),
            timeTaken: 60,
          });
          setSubmittedQIds((prev) => new Set(prev).add(qId));
        }
        // Mark index as answered ONLY if answer text was provided
        setAnsweredIndices((prev) => new Set(prev).add(currentIdx));
      } else {
        toast('Question skipped without an answer.', { icon: 'ℹ️' });
      }

      // 2. Advance to next question
      const nextResult = await interviewService.nextQuestion(interviewId);

      if (nextResult.isFinished) {
        toast.success('Interview Finished!');
        await interviewService.finishInterview(interviewId);
        clearInterviewSession();
        navigate(`/ai-interviews/details/${interviewId}`);
        return;
      }

      // 3. Update view with next question data
      setCurrentQData(nextResult.currentQuestion);
      setQuestionNumber(nextResult.questionNumber);
      setTotalQuestions(nextResult.totalQuestions);
      setRemainingTime(nextResult.remainingTime || 120);

      const nextQId = nextResult.currentQuestion.id;
      setAnswerText(answersMap[nextQId] || '');
    } catch (err) {
      toast.error(err.message || 'Error advancing to next question');
    } finally {
      setSubmitting(false);
    }
  };

  // Manual finish handler
  const handleSubmit = async () => {
    if (!currentQData) return;

    setSubmitting(true);
    try {
      const qId = currentQData.id;

      if (answerText.trim() && !submittedQIds.has(qId)) {
        await interviewService.submitAnswer(interviewId, {
          questionId: qId,
          answer: answerText.trim(),
          timeTaken: 60,
        });
      }

      await interviewService.finishInterview(interviewId);
      toast.success('Interview session completed successfully!');
      clearInterviewSession();
      navigate(`/ai-interviews/details/${interviewId}`);
    } catch (err) {
      toast.error(err.message || 'Failed to complete interview');
    } finally {
      setSubmitting(false);
    }
  };

  const dummyQuestionsList = Array.from({ length: totalQuestions }, (_, i) => ({
    id: i === questionNumber - 1 ? (currentQData?.id || `q_${i}`) : `q_${i}`,
    question: i === questionNumber - 1 ? currentQData?.question : `Question ${i + 1}`,
    isAnswered: answeredIndices.has(i),
  }));

  if (loading) {
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] justify-center items-center">
        <Loader2 className="h-10 w-10 text-[#60A5FA] animate-spin mb-4" />
        <h2 className="text-sm font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">
          Fetching Current Question...
        </h2>
        <p className="text-xs font-semibold text-gray-400 mt-1">Connecting to Interview Engine backend</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      {/* Thin progress strip */}
      <SessionProgressBar current={questionNumber} total={totalQuestions} />

      {/* Top bar */}
      <SessionTopBar
        session={session}
        currentIndex={questionNumber - 1}
        total={totalQuestions}
        remainingTime={remainingTime}
      />

      {/* Main Content + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main content column */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 space-y-5">
            {/* Question card */}
            <QuestionCard
              questionNumber={questionNumber}
              total={totalQuestions}
              type={currentQData?.interviewType || currentQData?.category || 'Technical'}
              question={currentQData?.question || 'Question content loading...'}
            />

            {/* Answer text area */}
            <AnswerTextArea
              key={currentQData?.id}
              value={answerText}
              onChange={handleAnswerChange}
              questionId={currentQData?.id}
              disabled={submitting}
            />
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="shrink-0 w-72 xl:w-80 overflow-y-auto p-4 pr-6 hidden lg:block">
          <SessionSidebar
            questions={dummyQuestionsList}
            answers={answersMap}
            currentIndex={questionNumber - 1}
            estimatedMins={session.estimatedMins || 15}
            onJump={() => {}}
          />
        </div>
      </div>

      {/* Bottom Nav */}
      <SessionNav
        currentIndex={questionNumber - 1}
        total={totalQuestions}
        submitting={submitting}
        onPrev={() => {}}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
