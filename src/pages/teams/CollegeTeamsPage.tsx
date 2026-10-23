import React, { useEffect, useState } from 'react';
import { teamService, Team } from '@/services/api/teamService';
import { TeamCard } from '@/components/teams/TeamCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Building2 } from 'lucide-react';

export const CollegeTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCollegeTeams = async () => {
      setIsLoading(true);
      try {
        const res = await teamService.getTeams({ scope: 'COLLEGE' });
        setTeams(res.data || []);
      } catch {
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollegeTeams();
  }, []);

  return (
    <div className="space-y-6 text-left pb-12">
      <div className="flex items-center gap-2">
        <Building2 className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My College Teams</h1>
          <p className="text-xs text-slate-500">Discover teams formed by students in your institution</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Recruiting Teams in Your College</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Be the first to create a team for an upcoming hackathon!
          </p>
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
