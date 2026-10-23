import React, { useEffect, useState } from 'react';
import { teamService, Team } from '@/services/api/teamService';
import { TeamCard } from '@/components/teams/TeamCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { Users, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyTeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyTeams = async () => {
      setIsLoading(true);
      try {
        const res = await teamService.getMyTeams();
        setTeams(res.data || []);
      } catch {
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyTeams();
  }, []);

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Teams Workspace</h1>
          <p className="text-xs text-slate-500">All competition teams where you are a member or team lead</p>
        </div>

        <Button onClick={() => navigate('/teams/create')} leftIcon={<PlusCircle className="w-4 h-4" />}>
          Create New Team
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Active Team Memberships</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You haven't joined or created any teams yet. Discover recruiting teams or form your own team!
          </p>
          <Button onClick={() => navigate('/teams')}>Explore Recruiting Teams</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      )}
    </div>
  );
};
