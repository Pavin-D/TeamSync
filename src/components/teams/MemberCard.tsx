import React, { useState } from 'react';
import { TeamMember } from '@/services/api/teamService';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Crown, GraduationCap, Briefcase, MoreVertical, Flag, UserX } from 'lucide-react';

export interface MemberCardProps {
  member: TeamMember;
  isCurrentLead?: boolean;
  onRemoveMember?: (memberId: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, isCurrentLead = false, onRemoveMember }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <Card className="p-4 flex flex-col justify-between text-left relative">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <Avatar name={member.name} src={member.avatarUrl} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                {(member.role === 'TEAM_LEAD' || member.role === 'LEAD') && (
                  <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500">{member.college || 'Institution'}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Badge variant={member.role === 'TEAM_LEAD' || member.role === 'LEAD' ? 'primary' : 'default'}>
              {member.role === 'TEAM_LEAD' || member.role === 'LEAD' ? 'Team Lead' : 'Member'}
            </Badge>

            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              aria-label="More member options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Overflow Dropdown */}
            {showMenu && (
              <div className="absolute right-3 top-10 w-40 bg-white border border-slate-200 rounded-xl shadow-popover z-20 py-1 text-xs">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    alert(`Report flag submitted for ${member.name}`);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Flag className="w-3.5 h-3.5 text-slate-400" /> Report User
                </button>

                {isCurrentLead && member.role !== 'TEAM_LEAD' && member.role !== 'LEAD' && onRemoveMember && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onRemoveMember(member.id);
                    }}
                    className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold border-t border-slate-100"
                  >
                    <UserX className="w-3.5 h-3.5" /> Remove Member
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            {member.userType === 'STUDENT' ? (
              <GraduationCap className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            ) : (
              <Briefcase className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            )}
            <span>
              {member.userType || 'STUDENT'} • {member.department || 'Department'}
            </span>
          </div>
        </div>

        {member.skills && member.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {member.skills.map((s) => (
              <SkillBadge key={s} skill={s} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
