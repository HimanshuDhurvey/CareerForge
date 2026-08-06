import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  X,
  ClipboardList,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import Sidebar from '../../dashboard/components/Sidebar';
import TopNavbar from '../../dashboard/components/TopNavbar';
import HistoryCard from '../components/HistoryCard';
import { interviewService } from '../../../services/interviewService';
import { COMPANY_FILTER_OPTIONS } from '../data/interviewHistory';
import {
  TYPE_FILTER_OPTIONS,
  DIFFICULTY_FILTER_OPTIONS,
  SORT_OPTIONS,
} from '../data/interviewTypes';

// ─── Small select component ───────────────────────────────────────────────────
function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1 min-w-[130px]">
      <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 px-3 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-xs font-semibold text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent cursor-pointer appearance-none transition-colors"
      >
        {options.map((opt) => (
          <option
            key={typeof opt === 'string' ? opt : opt.key}
            value={typeof opt === 'string' ? opt : opt.key}
          >
            {typeof opt === 'string' ? opt : opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Active filter pill ───────────────────────────────────────────────────────
function FilterPill({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full">
      {label}
      <button
        onClick={onRemove}
        className="hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onReset }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl mb-4">
        <ClipboardList className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-sm font-extrabold text-[#111111] dark:text-white mb-1">
        No interviews found
      </h3>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-5 max-w-xs">
        No interviews match your current filters or no interview sessions created yet.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 h-9 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
      >
        <X className="h-3.5 w-3.5" />
        Clear All Filters
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InterviewHistory() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [interviewsList, setInterviewsList] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [company, setCompany] = useState('All');
  const [type, setType] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [sort, setSort] = useState('latest');

  // Load interviews from backend API
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await interviewService.getUserInterviews({ page: 1, limit: 100 });
        const items = data.interviews || [];

        // Map backend interview properties to frontend card format
        const formattedItems = items.map((item) => ({
          id: item.id,
          company: item.title?.split('-')[0]?.trim() || 'Target Company',
          role: item.role || item.title || 'Developer',
          type: item.interviewType || 'Technical',
          difficulty: item.difficulty || 'Medium',
          status: item.status,
          score: item.score || 0,
          date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
          duration: `${item.duration || 10} mins`,
          totalQuestions: item.totalQuestions,
        }));

        setInterviewsList(formattedItems);
      } catch (err) {
        toast.error(err.message || 'Failed to load interview history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Derived: filtered + sorted data
  const filtered = useMemo(() => {
    let data = [...interviewsList];

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      data = data.filter(
        (i) =>
          i.company.toLowerCase().includes(q) ||
          i.role.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q)
      );
    }
    if (company !== 'All') data = data.filter((i) => i.company === company);
    if (type !== 'All') data = data.filter((i) => i.type === type);
    if (difficulty !== 'All') data = data.filter((i) => i.difficulty === difficulty);

    switch (sort) {
      case 'oldest':
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'scoreDesc':
        data.sort((a, b) => b.score - a.score);
        break;
      case 'scoreAsc':
        data.sort((a, b) => a.score - b.score);
        break;
      default:
        // latest
        break;
    }

    return data;
  }, [interviewsList, search, company, type, difficulty, sort]);

  // Active filter pills
  const activePills = [
    company !== 'All' && { label: `Company: ${company}`, clear: () => setCompany('All') },
    type !== 'All' && { label: `Type: ${type}`, clear: () => setType('All') },
    difficulty !== 'All' && { label: `Difficulty: ${difficulty}`, clear: () => setDifficulty('All') },
    search.trim() && { label: `"${search.trim()}"`, clear: () => setSearch('') },
  ].filter(Boolean);

  const resetAll = () => {
    setSearch('');
    setCompany('All');
    setType('All');
    setDifficulty('All');
    setSort('latest');
  };

  // Aggregate stats
  const totalCount = interviewsList.length;
  const avgScore =
    totalCount > 0
      ? Math.round(interviewsList.reduce((sum, i) => sum + i.score, 0) / totalCount)
      : 0;
  const bestScore = totalCount > 0 ? Math.max(...interviewsList.map((i) => i.score)) : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0b0f19] transition-colors">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen((p) => !p)} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            {/* ── Page Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[#60A5FA] mb-1">
                  <ClipboardList className="h-4 w-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest">
                    AI Mock Interviews
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#111111] dark:text-white tracking-tight">
                  Interview History
                </h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">
                  Review your past sessions and track your progress over time.
                </p>
              </div>

              <button
                onClick={() => navigate('/ai-interviews/setup')}
                className="shrink-0 inline-flex items-center gap-2 h-11 px-5 bg-[#60A5FA] hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                <PlusCircle className="h-4 w-4" />
                New Interview
              </button>
            </div>

            {/* ── Stat strips ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Sessions', value: totalCount, color: 'text-[#111111] dark:text-white' },
                { label: 'Avg Score', value: `${avgScore}%`, color: 'text-[#60A5FA]' },
                { label: 'Best Score', value: `${bestScore}%`, color: 'text-emerald-500' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-4 shadow-xs text-center"
                >
                  <div className={`text-xl sm:text-2xl font-extrabold tabular-nums ${color}`}>
                    {value}
                  </div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* ── Filter Bar ──────────────────────────────────────────────── */}
            <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
              {/* Search + sort row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by company, role, or type..."
                    className="w-full h-10 pl-9 pr-4 bg-gray-50 dark:bg-gray-800/40 border border-[#E5E7EB] dark:border-gray-800 rounded-xl text-xs font-medium text-[#111111] dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] focus:border-transparent transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="flex items-end gap-1.5 shrink-0">
                  <ArrowDownUp className="h-3.5 w-3.5 text-gray-400 self-center" />
                  <FilterSelect
                    label="Sort By"
                    value={sort}
                    onChange={setSort}
                    options={SORT_OPTIONS}
                  />
                </div>
              </div>

              {/* Filter selects row */}
              <div className="flex flex-wrap gap-3 items-end">
                <SlidersHorizontal className="h-4 w-4 text-gray-400 self-end mb-2.5" />
                <FilterSelect
                  label="Company"
                  value={company}
                  onChange={setCompany}
                  options={COMPANY_FILTER_OPTIONS}
                />
                <FilterSelect
                  label="Type"
                  value={type}
                  onChange={setType}
                  options={TYPE_FILTER_OPTIONS}
                />
                <FilterSelect
                  label="Difficulty"
                  value={difficulty}
                  onChange={setDifficulty}
                  options={DIFFICULTY_FILTER_OPTIONS}
                />

                {activePills.length > 0 && (
                  <button
                    onClick={resetAll}
                    className="h-9 px-3 self-end text-[10px] font-bold text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active filter pills */}
              {activePills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
                  {activePills.map((pill, idx) => (
                    <FilterPill key={idx} label={pill.label} onRemove={pill.clear} />
                  ))}
                </div>
              )}
            </div>

            {/* ── Loading state ───────────────────────────────────────────── */}
            {loading ? (
              <div className="bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 text-[#60A5FA] animate-spin mb-3" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Loading Interview History...
                </p>
              </div>
            ) : (
              <>
                {/* ── Results count ────────────────────────────────────────────── */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                    Showing{' '}
                    <span className="font-extrabold text-[#111111] dark:text-white">
                      {filtered.length}
                    </span>{' '}
                    of{' '}
                    <span className="font-extrabold text-[#111111] dark:text-white">
                      {totalCount}
                    </span>{' '}
                    interviews
                  </span>
                </div>

                {/* ── Cards Grid ───────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-8">
                  {filtered.length > 0 ? (
                    filtered.map((interview) => (
                      <HistoryCard key={interview.id} interview={interview} />
                    ))
                  ) : (
                    <EmptyState onReset={resetAll} />
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
