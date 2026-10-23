import React from 'react';
import { CollegeRanking } from '@/services/api/rankingService';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CollegeRankingCardProps {
  college: CollegeRanking;
}

export const CollegeRankingCard: React.FC<CollegeRankingCardProps> = ({ college }) => {
  const navigate = useNavigate();

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-extrabold shadow-subtle';
    if (rank === 2) return 'bg-slate-300 text-slate-900 font-extrabold';
    if (rank === 3) return 'bg-amber-700 text-white font-extrabold';
    return 'bg-slate-100 text-slate-800 font-bold border border-slate-200';
  };

  const scoreVal = college.score || college.totalScore || 0;
  const partStudents = college.participatingStudents || college.activeParticipantsCount || college.totalStudents || 0;
  const eventsCount = college.eventsParticipated || college.totalEventsCount || 0;
  const winsCount = college.wins || college.totalWins || 0;
  const finalistsCount = college.finalists || college.totalFinalists || 0;

  return (
    <Card hoverable className="p-5 flex flex-col justify-between text-left space-y-4">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${getRankBadgeStyle(college.rank)}`}>
              Rank {college.rank}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">{college.collegeName}</h4>
              <p className="text-xs text-slate-500">{college.location || 'Registered Campus'}</p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1">
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              {scoreVal.toLocaleString()} pts
            </span>
            {college.rankMovement !== undefined && college.rankMovement !== 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> ↑ {college.rankMovement} positions
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Students</span>
            <span className="font-extrabold text-slate-900 text-sm">{partStudents}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Events</span>
            <span className="font-extrabold text-slate-900 text-sm">{eventsCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Wins</span>
            <span className="font-extrabold text-amber-600 text-sm">{winsCount}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Finalists</span>
            <span className="font-extrabold text-indigo-600 text-sm">{finalistsCount}</span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/colleges/${college.collegeId}`)}
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          View College Page
        </Button>
      </div>
    </Card>
  );
};
