import React from 'react';
import { StudentRanking } from '@/services/api/rankingService';
import { Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface RankingTableProps {
  students: StudentRanking[];
  currentUserId?: string;
}

export const RankingTable: React.FC<RankingTableProps> = ({ students, currentUserId }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle text-left">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <th className="p-3.5">Rank</th>
            <th className="p-3.5">Student</th>
            <th className="p-3.5">Institution / Dept</th>
            <th className="p-3.5 text-center">Events</th>
            <th className="p-3.5 text-center">Wins 🏆</th>
            <th className="p-3.5 text-center">Finalists ⭐</th>
            <th className="p-3.5 text-right">Score</th>
            <th className="p-3.5 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs">
          {students.map((s) => {
            const isMe = currentUserId === s.userId;
            return (
              <tr key={s.studentId} className={`hover:bg-slate-50/80 transition ${isMe ? 'bg-brand-50/30' : ''}`}>
                <td className="p-3.5 font-extrabold text-slate-900">
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm">#{s.rank}</span>
                    {s.rankMovement ? (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                        <TrendingUp className="w-3 h-3" />+{s.rankMovement}
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={s.name} src={s.avatarUrl} size="sm" />
                    <div>
                      <span className="font-bold text-slate-900 block">{s.name}</span>
                      {isMe && <span className="text-[9px] font-bold text-brand-600 uppercase">You</span>}
                    </div>
                  </div>
                </td>
                <td className="p-3.5 text-slate-600 font-medium">
                  {s.college} <span className="text-slate-400">• {s.department}</span>
                </td>
                <td className="p-3.5 text-center font-bold text-slate-800">{s.eventsParticipated}</td>
                <td className="p-3.5 text-center font-extrabold text-amber-600">{s.wins}</td>
                <td className="p-3.5 text-center font-extrabold text-indigo-600">{s.finalists}</td>
                <td className="p-3.5 text-right font-extrabold text-brand-600 font-mono">{s.score} pts</td>
                <td className="p-3.5 text-right">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/recommendations/${s.userId}`)}
                    rightIcon={<ExternalLink className="w-3 h-3" />}
                  >
                    View Profile
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
