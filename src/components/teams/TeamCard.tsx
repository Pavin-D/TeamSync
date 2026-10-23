import React from 'react';
import { Team } from '@/services/api/teamService';
import { Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Crown, Users, ArrowRight, UserPlus, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TeamCardProps {
  team: Team;
  onRequestJoin?: (teamId: string) => void;
  className?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, onRequestJoin, className }) => {
  const navigate = useNavigate();

  const currentCount = team.currentMemberCount || team.currentMembersCount || (team.members ? team.members.length : 1);
  const maxCapacity = team.maximumMembers || team.maxMembers || 4;
  const isFull = currentCount >= maxCapacity;
  const isRecruiting = (team.recruitmentOpen !== false) && (team.recruitmentStatus === 'RECRUITING' || team.status === 'RECRUITING') && !isFull;
  const slotsRemaining = maxCapacity - currentCount;

  const getStatusBadge = (status?: Team['recruitmentStatus']) => {
    if (isFull) return <Badge variant="warning" className="font-semibold">Team Full</Badge>;
    switch (status || team.status) {
      case 'RECRUITING':
        return <Badge variant="success">Recruiting</Badge>;
      case 'PAUSED':
        return <Badge variant="warning">Recruitment Paused</Badge>;
      case 'CLOSED':
        return <Badge variant="default">Recruitment Closed</Badge>;
      default:
        return <Badge variant="outline">{status || team.status || 'Recruiting'}</Badge>;
    }
  };

  const getScopeBadge = (scope: Team['scope']) => {
    const scopeLabels: Record<string, string> = {
      DEPARTMENT: 'Department Scope',
      COLLEGE: 'College Scope',
      ALL_COLLEGES: 'All Colleges',
      GLOBAL: 'Global Scope',
    };
    return (
      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
        {scopeLabels[scope] || scope || 'All Colleges'}
      </span>
    );
  };

  return (
    <div
      onClick={() => navigate(`/teams/${team.id}`)}
      className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:shadow-popover transition duration-200 flex flex-col justify-between cursor-pointer text-left ${className}`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStatusBadge(team.recruitmentStatus)}
          <div className="flex items-center gap-1.5">
            {getScopeBadge(team.scope)}
            {team.teamType && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                {team.teamType}
              </span>
            )}
          </div>
        </div>

        {/* Team Title & Event Name */}
        <h3 className="text-base font-bold text-slate-900 mb-1 leading-snug">{team.name}</h3>
        <p className="text-xs font-semibold text-brand-600 mb-3 truncate">{team.eventName || team.eventTitle || 'Global Event'}</p>

        {team.posterUrl && (
          <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-36 shadow-xs">
            <img
              src={team.posterUrl}
              alt={`${team.name} Hackathon Poster`}
              className="w-full h-32 object-cover hover:scale-105 transition duration-300"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {team.problemStatementTitle && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-1 italic bg-slate-50 p-2 rounded-lg">
            Problem: {team.problemStatementTitle}
          </p>
        )}

        {/* Capacity & Team Lead Summary */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Team Lead:
            </span>
            <span className="font-semibold text-slate-800">{team.teamLead?.name || 'Lead Student'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-500">
              <Users className="w-3.5 h-3.5 text-brand-600 shrink-0" /> Capacity:
            </span>
            <span className="font-bold text-slate-900">
              {currentCount} / {maxCapacity} Members
              {!isFull && <span className="text-emerald-600 ml-1 font-semibold">({slotsRemaining} slot{slotsRemaining === 1 ? '' : 's'} left)</span>}
            </span>
          </div>
        </div>

        {/* Required Skills */}
        {team.requiredSkills && team.requiredSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Skills Needed:</span>
            <div className="flex flex-wrap gap-1.5">
              {team.requiredSkills.slice(0, 4).map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
              {team.requiredSkills.length > 4 && (
                <span className="text-[11px] text-slate-400 self-center">+{team.requiredSkills.length - 4} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Button
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/teams/${team.id}`);
          }}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Team
        </Button>

        {team.isCurrentUserLead ? (
          <SecondaryButton
            size="sm"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/student/recommendations?teamId=${team.id}`);
            }}
            leftIcon={<Users className="w-3.5 h-3.5 text-brand-600" />}
          >
            Find Matches
          </SecondaryButton>
        ) : team.isCurrentUserMember ? (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-center flex-1">
            Member ✓
          </span>
        ) : team.userRequestStatus === 'PENDING' ? (
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-center flex-1">
            Request Pending
          </span>
        ) : (
          <SecondaryButton
            size="sm"
            fullWidth
            disabled={!isRecruiting}
            onClick={(e) => {
              e.stopPropagation();
              if (onRequestJoin) onRequestJoin(team.id);
            }}
            leftIcon={isFull ? <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> : <UserPlus className="w-3.5 h-3.5 text-brand-600" />}
          >
            {isFull ? 'Team Full' : 'Request to Join'}
          </SecondaryButton>
        )}
      </div>
    </div>
  );
};
