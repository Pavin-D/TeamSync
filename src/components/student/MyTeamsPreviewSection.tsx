import React from 'react';
import { MyTeamPreview } from '@/services/api/studentService';
import { Team } from '@/services/api/teamService';
import { TeamCard } from '@/components/teams/TeamCard';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ChevronRight, Inbox } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export interface MyTeamsPreviewSectionProps {
  teams?: MyTeamPreview[];
}

export const MyTeamsPreviewSection: React.FC<MyTeamsPreviewSectionProps> = ({ teams }) => {
  const navigate = useNavigate();

  const mappedTeams: Team[] = teams
    ? teams.map((t) => ({
        id: t.id,
        name: t.name,
        description: `Team formed for ${t.eventName}`,
        eventId: 'evt_01',
        eventName: t.eventName,
        teamLead: {
          id: 'lead_1',
          userId: 'lead_1',
          name: t.teamLeadName,
          role: 'TEAM_LEAD',
          userType: 'STUDENT',
          college: 'Stanford University',
          department: 'Computer Science',
          skills: ['React', 'Python'],
          joinedAt: 'Aug 01',
        },
        members: [],
        minimumMembers: 2,
        maximumMembers: t.maxMembers,
        currentMemberCount: t.memberCount,
        scope: 'GLOBAL',
        teamType: 'MIXED',
        requiredSkills: ['React', 'TypeScript', 'Node.js'],
        recruitmentStatus: t.status === 'RECRUITING' ? 'RECRUITING' : 'FULL',
        createdAt: 'Aug 01, 2026',
        updatedAt: 'Aug 01, 2026',
        isCurrentUserMember: true,
      }))
    : getFallbackTeams();

  function getFallbackTeams(): Team[] {
    return [
      {
        id: 't_01',
        name: 'NeuralForge Hackers',
        description: 'Building an AI clinical diagnostic assistant.',
        eventId: 'evt_01',
        eventName: 'AI Innovation Hackathon',
        teamLead: {
          id: 'lead_1',
          userId: 'lead_1',
          name: 'Rahul Verma',
          role: 'TEAM_LEAD',
          userType: 'STUDENT',
          college: 'Stanford University',
          department: 'Computer Science',
          skills: ['React'],
          joinedAt: 'Aug 01',
        },
        members: [],
        minimumMembers: 2,
        maximumMembers: 5,
        currentMemberCount: 4,
        scope: 'GLOBAL',
        teamType: 'MIXED',
        requiredSkills: ['PyTorch', 'FastAPI', 'React'],
        recruitmentStatus: 'RECRUITING',
        createdAt: 'Aug 01, 2026',
        updatedAt: 'Aug 01, 2026',
        isCurrentUserMember: true,
      },
      {
        id: 't_02',
        name: 'CyberShield Squad',
        description: 'National cybersecurity threat defense team.',
        eventId: 'evt_03',
        eventName: 'Global Cyber Security Summit',
        teamLead: {
          id: 'lead_2',
          userId: 'lead_2',
          name: 'Alex Morgan (You)',
          role: 'TEAM_LEAD',
          userType: 'STUDENT',
          college: 'Stanford University',
          department: 'Cybersecurity',
          skills: ['Linux'],
          joinedAt: 'Aug 01',
        },
        members: [],
        minimumMembers: 2,
        maximumMembers: 3,
        currentMemberCount: 3,
        scope: 'ALL_COLLEGES',
        teamType: 'STUDENT',
        requiredSkills: ['Linux', 'Network Security'],
        recruitmentStatus: 'FULL',
        createdAt: 'Aug 01, 2026',
        updatedAt: 'Aug 01, 2026',
        isCurrentUserLead: true,
        isCurrentUserMember: true,
      },
    ];
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">My Teams</h3>
          <p className="text-xs text-slate-500">Teams you belong to or lead</p>
        </div>
        <Link
          to="/student/teams"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          <span>View All Teams</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {mappedTeams.length === 0 ? (
        <Card className="p-6 text-center">
          <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <h4 className="text-sm font-semibold text-slate-900">No teams yet</h4>
          <p className="text-xs text-slate-500 mb-4">Create a team or discover people with matching skills.</p>
          <Button size="sm" onClick={() => navigate('/teams')}>
            Find Teammates
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mappedTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  );
};
