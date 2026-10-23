import React from 'react';
import { RecommendedTeam } from '@/services/api/recommendationService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Users, Target, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TeamRecommendationCardProps {
  team: RecommendedTeam;
}

export const TeamRecommendationCard: React.FC<TeamRecommendationCardProps> = ({ team }) => {
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-brand-600 bg-brand-50 border-brand-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <Card className="relative overflow-hidden flex flex-col justify-between hover:shadow-popover transition duration-300">
      <div className="absolute top-0 right-0 p-4">
        <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full border-2 ${getScoreColor(team.compatibilityScore)} shadow-sm`}>
          <span className="text-sm font-black">{Math.round(team.compatibilityScore)}%</span>
          <span className="text-[8px] font-bold uppercase tracking-wider -mt-1">Match</span>
        </div>
      </div>

      <div className="pr-14 mb-4">
        <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider font-bold">Recommended Team</Badge>
        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{team.name || team.teamName}</h3>
        <p className="text-sm font-medium text-brand-600 truncate">{team.eventName}</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center text-xs text-slate-600 gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <Target className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="font-semibold text-slate-700 italic">{team.reason}</span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Lead: {team.teamLeadName}</span>
          <span className="font-semibold">{team.membersCount} / {team.maxMembers} Members</span>
        </div>
      </div>

      {team.requiredSkills && team.requiredSkills.length > 0 && (
        <div className="mb-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Team is looking for:</span>
          <div className="flex flex-wrap gap-1.5">
            {team.requiredSkills.map(skill => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </div>
      )}

      <Button
        fullWidth
        onClick={() => navigate(`/teams/${team.teamId}`)}
        rightIcon={<ArrowRight className="w-4 h-4" />}
        className="mt-auto"
      >
        View Team Profile
      </Button>
    </Card>
  );
};
