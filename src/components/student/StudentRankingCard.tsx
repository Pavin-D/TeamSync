import React from 'react';
import { StudentRanking } from '@/services/api/studentService';
import { Card } from '@/components/ui/Cards';
import { Trophy, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface StudentRankingCardProps {
  ranking?: StudentRanking;
}

export const StudentRankingCard: React.FC<StudentRankingCardProps> = ({
  ranking = {
    collegeRank: 12,
    globalRank: 428,
    hackathonsParticipated: 8,
    hackathonsWon: 3,
  },
}) => {
  return (
    <Card className="flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Your Leaderboard Ranking</h3>
          </div>
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            Top 5% Student
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-amber-700 block">College Rank</span>
            <span className="text-2xl font-extrabold text-amber-900">#{ranking.collegeRank}</span>
          </div>

          <div className="bg-brand-50/60 border border-brand-200/80 p-3 rounded-xl">
            <span className="text-[10px] uppercase font-bold text-brand-700 block">Global Student Rank</span>
            <span className="text-2xl font-extrabold text-brand-900">#{ranking.globalRank}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl space-x-2">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Participated: <strong className="text-slate-900">{ranking.hackathonsParticipated}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Won: <strong className="text-slate-900">{ranking.hackathonsWon}</strong></span>
          </div>
        </div>
      </div>

      <Link
        to="/student/rankings"
        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition pt-3 border-t border-slate-100 mt-3"
      >
        <span>View Full Rankings Leaderboard</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </Card>
  );
};
