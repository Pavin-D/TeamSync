import React, { useEffect, useState } from 'react';
import {
  rankingService,
  StudentRanking,
  UserRankSummary,
  RankingScope,
  RankingPeriod,
} from '@/services/api/rankingService';
import { StudentRankingCard } from '@/components/rankings/StudentRankingCard';
import { RankingTable } from '@/components/rankings/RankingTable';
import { ComparisonModal } from '@/components/rankings/ComparisonModal';
import { Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Trophy, TrendingUp, Search, Filter } from 'lucide-react';

export const StudentRankingsPage: React.FC = () => {
  const [scope, setScope] = useState<RankingScope>('GLOBAL');
  const [period, setPeriod] = useState<RankingPeriod>('ALL_TIME');
  const [skill, setSkill] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [students, setStudents] = useState<StudentRanking[]>([]);
  const [userRankSummary, setUserRankSummary] = useState<UserRankSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Comparison modal state
  const [comparisonStudents, setComparisonStudents] = useState<StudentRanking[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const fetchRankings = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [studentsRes, rankRes] = await Promise.all([
        rankingService.getStudentRankings({ scope, period, skill: skill || undefined, search: search || undefined }),
        rankingService.getStudentRank(),
      ]);

      if (studentsRes.success && studentsRes.data) {
        setStudents(studentsRes.data);
      } else {
        setStudents([]);
      }

      if (rankRes.success && rankRes.data) {
        setUserRankSummary(rankRes.data);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRankings();
  }, [scope, period, skill, search]);

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Leaderboard"
        message="Unable to connect to the ranking service."
        onRetry={fetchRankings}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Platform Leaderboard</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Rankings</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Verified student leaderboard based on hackathon participation, winning achievements, and technical project score.
          </p>
        </div>
      </div>

      {/* 2. Sticky Current User Rank Position Banner */}
      {userRankSummary && (
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-2xl p-4 text-white shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-mono font-extrabold text-lg border border-white/20">
              #{userRankSummary.globalRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Your Global Ranking</h3>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" /> Active Performance
                </span>
              </div>
              <p className="text-xs text-brand-100">
                Score: <strong>{userRankSummary.score} pts</strong> • College Rank: <strong>#{userRankSummary.collegeRank || 'N/A'}</strong> • Dept Rank: <strong>#{userRankSummary.departmentRank || 'N/A'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <span className="block text-brand-200">Events: <strong>{userRankSummary.totalEvents || userRankSummary.eventsParticipated || 0}</strong></span>
              <span className="block text-amber-300">Wins: <strong>{userRankSummary.wins} 🏆</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Controls & Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Scope Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setScope('GLOBAL')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                scope === 'GLOBAL' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Global Leaderboard
            </button>
            <button
              type="button"
              onClick={() => setScope('COLLEGE')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                scope === 'COLLEGE' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              My College
            </button>
            <button
              type="button"
              onClick={() => setScope('DEPARTMENT')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                scope === 'DEPARTMENT' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              My Department
            </button>
          </div>

          {/* Time Period Selector */}
          <div className="flex items-center gap-2">
            <Select
              value={period}
              onChange={(e) => setPeriod(e.target.value as RankingPeriod)}
              options={[
                { value: 'ALL_TIME', label: 'All Time Ranking' },
                { value: '2026', label: 'Year 2026' },
                { value: '2025', label: 'Year 2025' },
              ]}
            />
          </div>
        </div>

        {/* Advanced Filter UI */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          
          <div className="relative flex-1 w-full group">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student by name or college..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-56 group">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-500 transition-colors pointer-events-none" />
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none appearance-none text-slate-700 font-medium cursor-pointer"
              >
                <option value="">All Tech Stacks</option>
                <option value="Python">Python / AI</option>
                <option value="React">React / Frontend</option>
                <option value="Node.js">Node.js / Backend</option>
                <option value="AWS">AWS / Cloud</option>
              </select>
            </div>

            {students.length >= 2 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setComparisonStudents(students.slice(0, 2));
                  setIsComparisonOpen(true);
                }}
                className="shrink-0 h-[42px] px-5 bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold whitespace-nowrap shadow-sm"
              >
                Compare Top 2
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Top 3 Podium Cards */}
      {!isLoading && students.length >= 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Top 3 Performing Students
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-3">
            {/* Rank 2 - Silver (Left) */}
            <div className="md:order-1 flex flex-col justify-end">
              <StudentRankingCard student={students[1]} />
            </div>

            {/* Rank 1 - Gold (Center Elevated Highlight) */}
            <div className="md:order-2 flex flex-col justify-end -mt-0 md:-mt-4">
              <div className="bg-gradient-to-b from-amber-400/30 via-amber-300/10 to-transparent p-1.5 rounded-3xl border-2 border-amber-400/70 shadow-lg h-full flex flex-col">
                <div className="bg-amber-400 text-slate-950 font-black text-[11px] uppercase tracking-wider text-center py-1 rounded-t-2xl mb-1 flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> #1 Champion
                </div>
                <StudentRankingCard student={students[0]} />
              </div>
            </div>

            {/* Rank 3 - Bronze (Right) */}
            <div className="md:order-3 flex flex-col justify-end">
              <StudentRankingCard student={students[2]} />
            </div>
          </div>
        </div>
      )}

      {/* 5. Complete Ranking Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">All Ranked Students ({students.length})</h2>

        {isLoading ? (
          <SkeletonLoader variant="table" count={5} />
        ) : students.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Ranking Records Available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No students have participated in hackathon events under this filter category yet.
            </p>
          </div>
        ) : (
          <RankingTable students={students} currentUserId={userRankSummary?.userId || ''} />
        )}
      </div>

      {/* Comparison Modal */}
      {isComparisonOpen && (
        <ComparisonModal
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          students={comparisonStudents}
        />
      )}
    </div>
  );
};
