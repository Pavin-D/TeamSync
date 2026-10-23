import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { teamService, Team, TeamFilterParams } from '@/services/api/teamService';
import { TeamCard } from '@/components/teams/TeamCard';
import { TeamFilters } from '@/components/teams/TeamFilters';
import { JoinRequestModal } from '@/components/teams/JoinRequestModal';
import { Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Search, Users, PlusCircle, SlidersHorizontal } from 'lucide-react';

export const TeamDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state sync
  const [filters, setFilters] = useState<TeamFilterParams>({
    search: searchParams.get('search') || '',
    scope: (searchParams.get('scope') as any) || undefined,
    status: (searchParams.get('status') as any) || undefined,
    teamType: (searchParams.get('teamType') as any) || undefined,
    skills: searchParams.get('skills') || undefined,
    remainingSlots: searchParams.get('remainingSlots') || undefined,
    college: searchParams.get('college') || undefined,
    department: searchParams.get('department') || undefined,
    sortBy: searchParams.get('sortBy') || 'RECOMMENDED',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Request modal state
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>('');

  const updateUrlParams = (newFilters: TeamFilterParams) => {
    const params: Record<string, string> = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.scope) params.scope = newFilters.scope;
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.teamType) params.teamType = newFilters.teamType;
    if (newFilters.skills) params.skills = newFilters.skills;
    if (newFilters.remainingSlots) params.remainingSlots = newFilters.remainingSlots;
    if (newFilters.college) params.college = newFilters.college;
    if (newFilters.department) params.department = newFilters.department;
    if (newFilters.sortBy) params.sortBy = newFilters.sortBy;
    if (newFilters.page && newFilters.page > 1) params.page = String(newFilters.page);

    setSearchParams(params, { replace: true });
  };

  const fetchTeamsData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await teamService.getTeams(filters);
      if (response.success && response.data) {
        setTeams(response.data);
      } else {
        setTeams([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsData();
  }, [searchParams]);

  const handleFilterChange = (key: keyof TeamFilterParams, value: any) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);
    updateUrlParams(updated);
  };

  const handleResetFilters = () => {
    const reset: TeamFilterParams = { search: '', sortBy: 'RECOMMENDED', page: 1 };
    setFilters(reset);
    setSearchParams({}, { replace: true });
  };

  const handleOpenJoinRequest = (teamId: string) => {
    const target = teams.find((t) => t.id === teamId);
    setSelectedTeamId(teamId);
    setSelectedTeamName(target?.name || 'Team');
  };

  const handleSendJoinRequest = async (message: string, skills: string[]) => {
    if (!selectedTeamId) return;
    await teamService.requestToJoinTeam(selectedTeamId, message, skills);
    setTeams((prev) =>
      prev.map((t) => (t.id === selectedTeamId ? { ...t, userRequestStatus: 'PENDING' } : t))
    );
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Teams"
        message="Unable to connect to the team discovery API service."
        onRetry={fetchTeamsData}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Users className="w-3.5 h-3.5 text-indigo-300" />
            <span>Team Discovery & Collaboration Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Find Your Winning Team</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Discover recruiting teams in your department, college, or globally across hackathons. Request to join or create your own team.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search teams by name, skill, event, technology, or college..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 backdrop-blur-md"
              />
            </div>

            <Button
              onClick={() => navigate('/teams/create')}
              size="md"
              className="w-full sm:w-auto shrink-0 bg-white text-slate-900 hover:bg-slate-100 font-semibold"
              leftIcon={<PlusCircle className="w-4 h-4 text-brand-600" />}
            >
              Create Team
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Reusable Team Filters */}
      <TeamFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. Header Controls & Sort */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recruiting Teams</h2>
            <p className="text-xs text-slate-500">
              Showing {teams.length} team{teams.length === 1 ? '' : 's'} matching your filters
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
            </span>
            <Select
              value={filters.sortBy || 'RECOMMENDED'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={[
                { value: 'RECOMMENDED', label: 'Recommended' },
                { value: 'SLOTS_LEFT', label: 'Most Open Slots' },
                { value: 'NEWEST', label: 'Newest Teams' },
                { value: 'MOST_MEMBERS', label: 'Most Members' },
              ]}
              className="w-48 text-xs"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={6} />
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-6">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Teams Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              We couldn't find any teams matching your search query or filters. Create your own team or reset filters.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold transition"
              >
                Reset Filters
              </button>
              <Button onClick={() => navigate('/teams/create')} leftIcon={<PlusCircle className="w-4 h-4" />}>
                Create Team
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((t) => (
              <TeamCard key={t.id} team={t} onRequestJoin={handleOpenJoinRequest} />
            ))}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      {selectedTeamId && (
        <JoinRequestModal
          isOpen={!!selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          teamName={selectedTeamName}
          onSubmit={handleSendJoinRequest}
        />
      )}
    </div>
  );
};
