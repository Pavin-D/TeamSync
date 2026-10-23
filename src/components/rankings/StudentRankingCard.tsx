import React from 'react';
import { StudentRanking } from '@/services/api/rankingService';
import { Card, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface StudentRankingCardProps {
  student: StudentRanking;
  isCurrentUser?: boolean;
}

export const StudentRankingCard: React.FC<StudentRankingCardProps> = ({
  student,
  isCurrentUser = false,
}) => {
  const navigate = useNavigate();

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return 'bg-amber-400 text-slate-950 font-extrabold shadow-subtle';
    if (rank === 2) return 'bg-slate-300 text-slate-900 font-extrabold';
    if (rank === 3) return 'bg-amber-700 text-white font-extrabold';
    return 'bg-slate-100 text-slate-800 font-bold border border-slate-200';
  };

  const skillsList = student.skills || [];
  const eventsCount = student.eventsParticipated || student.participationsCount || 0;
  const finalistVal = student.finalists || student.finalistCount || 0;

  return (
    <Card
      hoverable
      className={`p-5 flex flex-col justify-between text-left relative transition-all h-full ${
        isCurrentUser ? 'ring-2 ring-brand-500 bg-brand-50/20 border-brand-300' : ''
      }`}
    >
      <div>
        {/* Header with Rank Badge & Movement */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm ${getRankBadgeStyle(student.rank)}`}>
              Rank {student.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">{student.name}</h4>
                {isCurrentUser && (
                  <span className="text-[10px] font-bold uppercase text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                    You
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">{student.college} • {student.department}</p>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0 gap-1">
            <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
              {student.score} pts
            </span>
            {student.rankMovement !== undefined && student.rankMovement !== 0 && (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> ↑ {student.rankMovement} positions
              </span>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-2.5 rounded-xl mb-3 border border-slate-100">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Events</span>
            <span className="font-extrabold text-slate-900 text-sm">{eventsCount}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Wins 🏆</span>
            <span className="font-extrabold text-amber-600 text-sm">{student.wins}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Finalist ⭐</span>
            <span className="font-extrabold text-indigo-600 text-sm">{finalistVal}</span>
          </div>
        </div>

        {/* Primary Skills */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {skillsList.slice(0, 4).map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/recommendations/${student.userId || student.studentId}`)}
          rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
        >
          View Profile
        </Button>
      </div>
    </Card>
  );
};
