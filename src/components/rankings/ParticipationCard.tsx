import React from 'react';
import { ParticipationRecord, ParticipationResult } from '@/services/api/rankingService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Calendar, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ParticipationCardProps {
  record: ParticipationRecord;
}

export const ParticipationCard: React.FC<ParticipationCardProps> = ({ record }) => {
  const navigate = useNavigate();

  const getResultBadge = (result: ParticipationResult | string) => {
    const resUpper = (result || '').toUpperCase();
    switch (resUpper) {
      case 'WINNER':
      case 'WIN':
        return <Badge variant="success">🏆 Winner</Badge>;
      case 'RUNNER_UP':
      case 'RUNNER-UP':
        return <Badge variant="warning">🥈 Runner Up</Badge>;
      case 'FINALIST':
        return <Badge variant="primary">⭐ Finalist</Badge>;
      case 'TOP_10':
        return <Badge variant="primary">Top 10</Badge>;
      default:
        return <Badge variant="default">Participant</Badge>;
    }
  };

  return (
    <Card hoverable className="p-5 flex flex-col justify-between text-left space-y-3">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-slate-900">{record.eventName || record.eventTitle || 'Event'}</h4>
              {getResultBadge(record.result)}
            </div>
            <p className="text-xs text-slate-500">Team: <strong className="text-slate-800">{record.teamName}</strong> • Role: {record.role || 'Member'}</p>
          </div>

          {record.isVerified && (
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Result ✓
            </span>
          )}
        </div>

        {record.problemStatement && (
          <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl italic mb-3">
            "{record.problemStatement}"
          </p>
        )}

        {record.technologies && record.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {record.technologies.map((tech) => (
              <SkillBadge key={tech} skill={tech} />
            ))}
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">
          <Calendar className="w-3.5 h-3.5" /> {record.date || record.participatedAt?.split('T')[0] || 'Recently'} {record.year ? `(${record.year})` : ''}
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/participation/${record.id}`)}
          rightIcon={<ExternalLink className="w-3 h-3" />}
        >
          View Participation
        </Button>
      </div>
    </Card>
  );
};
