import React from 'react';
import { ProblemStatement } from '@/services/api/eventService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Code2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface ProblemStatementCardProps {
  problem: ProblemStatement;
  eventId: string;
}

export const ProblemStatementCard: React.FC<ProblemStatementCardProps> = ({ problem, eventId }) => {
  const navigate = useNavigate();

  const getDifficultyBadge = (diff: ProblemStatement['difficulty']) => {
    switch (diff) {
      case 'EASY':
        return <Badge variant="success">Easy</Badge>;
      case 'MEDIUM':
        return <Badge variant="warning">Medium</Badge>;
      case 'HARD':
        return <Badge variant="danger">Hard</Badge>;
      default:
        return <Badge variant="default">{diff}</Badge>;
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between text-left">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant="primary">{problem.domain}</Badge>
          {getDifficultyBadge(problem.difficulty)}
        </div>

        <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">{problem.title}</h4>
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">{problem.shortDescription}</p>

        {problem.expectedDeliverables && problem.expectedDeliverables.length > 0 && (
          <div className="mb-4 space-y-1 text-xs">
            <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1">Expected Outcome:</span>
            {problem.expectedDeliverables.slice(0, 2).map((item, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="truncate">{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Required Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {problem.requiredSkills.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Button
          size="sm"
          fullWidth
          onClick={() => navigate(`/events/${eventId}/problems/${problem.id}`)}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Problem Details
        </Button>
        <SecondaryButton
          size="sm"
          fullWidth
          onClick={() => navigate(`/events/${eventId}/find-team`)}
          leftIcon={<Code2 className="w-3.5 h-3.5 text-brand-600" />}
        >
          Find Team for Problem
        </SecondaryButton>
      </div>
    </Card>
  );
};
