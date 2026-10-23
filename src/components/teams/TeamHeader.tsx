import React from 'react';
import { Team } from '@/services/api/teamService';
import { Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Crown, Users, Edit3, UserPlus, Settings, UserCheck, CheckSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TeamHeaderProps {
  team: Team;
  isLead?: boolean;
  isMember?: boolean;
  onRequestJoin?: () => void;
  onAssignTask?: () => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({
  team,
  isLead = false,
  isMember = false,
  onRequestJoin,
  onAssignTask,
}) => {
  const navigate = useNavigate();

  const currentCount = team.currentMemberCount || team.currentMembersCount || (team.members ? team.members.length : 1);
  const maxCapacity = team.maximumMembers || team.maxMembers || 4;
  const isFull = currentCount >= maxCapacity;
  const isRecruiting = (team.recruitmentOpen !== false) && (team.recruitmentStatus === 'RECRUITING' || team.status === 'RECRUITING') && !isFull;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-modal text-left space-y-6">
      {team.posterUrl && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-56 shadow-sm">
          <img
            src={team.posterUrl}
            alt={`${team.name} Hackathon Poster`}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isFull ? 'warning' : isRecruiting ? 'success' : 'default'}>
            {isFull ? 'Team Full' : team.recruitmentStatus || team.status || 'Recruiting'}
          </Badge>
          <Badge variant="outline">{(team.scope || 'ALL_COLLEGES').replace('_', ' ')} Scope</Badge>
          {team.teamType && <Badge variant="primary">{team.teamType}</Badge>}
        </div>

        {/* Lead Controls / Join Actions / Assign Task */}
        <div className="flex items-center gap-2 flex-wrap">
          {(isLead || isMember) && onAssignTask && (
            <Button size="sm" onClick={onAssignTask} leftIcon={<CheckSquare className="w-4 h-4" />} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              + Assign Task
            </Button>
          )}
          {isLead ? (
            <>
              <Button size="sm" onClick={() => navigate(`/teams/${team.id}/edit`)} leftIcon={<Edit3 className="w-4 h-4" />}>
                Edit Team
              </Button>
              <SecondaryButton size="sm" onClick={() => navigate(`/teams/${team.id}/requests`)} leftIcon={<Settings className="w-4 h-4" />}>
                Manage Requests
              </SecondaryButton>
              <SecondaryButton size="sm" onClick={() => navigate(`/teams/${team.id}/invite`)} leftIcon={<UserPlus className="w-4 h-4 text-brand-600" />}>
                Invite Teammates
              </SecondaryButton>
            </>
          ) : isMember ? (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" /> Team Member
            </span>
          ) : team.userRequestStatus === 'PENDING' ? (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              Request Pending Review
            </span>
          ) : (
            <Button disabled={!isRecruiting} onClick={onRequestJoin} leftIcon={<UserPlus className="w-4 h-4" />}>
              {isFull ? 'Team Capacity Reached' : 'Request to Join Team'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {team.name}
          </h1>

          <p className="text-xs font-semibold text-brand-600">Event: {team.eventName || team.eventTitle || 'Global Competition'}</p>

          {team.problemStatementTitle && (
            <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
              <strong>Problem Statement:</strong> {team.problemStatementTitle}
            </p>
          )}

          <p className="text-xs text-slate-500 leading-relaxed pt-1">{team.description}</p>
        </div>

        {/* Member Capacity Gauge */}
        <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Users className="w-4 h-4 text-brand-600" /> Member Capacity
            </span>
            <span className="font-extrabold text-slate-900">
              {currentCount} / {maxCapacity}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${isFull ? 'bg-amber-500' : 'bg-brand-600'}`}
              style={{ width: `${Math.min(100, (currentCount / maxCapacity) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-slate-700">
              <Crown className="w-3.5 h-3.5 text-amber-500" /> Lead: {team.teamLead?.name || 'Lead'}
            </span>
            <span>{maxCapacity - currentCount} slots available</span>
          </div>
        </div>
      </div>
    </div>
  );
};
