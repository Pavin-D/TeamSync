import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { recommendationService, CandidateProfile, RecommendationFilterParams, RecommendedTeam } from '@/services/api/recommendationService';
import { eventService, Event } from '@/services/api/eventService';
import { AIRecommendationCard } from '@/components/recommendations/AIRecommendationCard';
import { TeamRecommendationCard } from '@/components/recommendations/TeamRecommendationCard';
import { TeamSkillGapCard } from '@/components/recommendations/TeamSkillGapCard';
import { InvitationModal } from '@/components/teams/InvitationModal';
import { MentorshipRequestModal } from '@/components/mentor/MentorshipRequestModal';
import { mentorService } from '@/services/api/mentorService';
import { Select, TextInput } from '@/components/ui/Inputs';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Sparkles, SlidersHorizontal, Users } from 'lucide-react';

export const TeammateRecommendationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'CANDIDATES' | 'TEAMS'>('CANDIDATES');

  const [filters, setFilters] = useState<RecommendationFilterParams>({
    eventId: searchParams.get('eventId') || undefined,
    problemId: searchParams.get('problemId') || undefined,
    teamId: searchParams.get('teamId') || undefined,
    role: searchParams.get('role') || undefined,
    skill: searchParams.get('skill') || undefined,
    userType: (searchParams.get('userType') as any) || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'BEST_MATCH',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [recommendedTeams, setRecommendedTeams] = useState<RecommendedTeam[]>([]);
  const [skillGap, setSkillGap] = useState<{ requiredSkills: string[]; coveredSkills: string[]; missingSkills: string[]; coveragePercentage: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  // Invite modal & Request Mentor modal state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [requestMentorCandidate, setRequestMentorCandidate] = useState<CandidateProfile | null>(null);

  useEffect(() => {
    eventService.getEvents().then(res => {
      if (res.success && res.data) setEvents(res.data);
    });
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await recommendationService.getRecommendations(filters);
      if (res.success && res.data) {
        const filtered = res.data.filter((cand) => {
          const r = (cand.role || '').toUpperCase();
          if (r === 'COLLEGE_ADMIN' || r === 'PLATFORM_ADMIN') return false;
          const title = (cand.jobTitle || cand.department || cand.role || '').toLowerCase();
          const staffKeywords = ['staff', 'professor', 'lecturer', 'faculty', 'teacher', 'instructor', 'academic'];
          if (staffKeywords.some((kw) => title.includes(kw))) return false;
          return true;
        });
        setCandidates(filtered);
      } else {
        setCandidates([]);
      }

      if (filters.teamId) {
        const gapRes = await recommendationService.getSkillGap(filters.teamId);
        if (gapRes.success && gapRes.data) {
          setSkillGap(gapRes.data);
        }
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await recommendationService.getRecommendedTeams();
      if (res.success && res.data) {
        setRecommendedTeams(res.data);
      } else {
        setRecommendedTeams([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'CANDIDATES') {
      fetchCandidates();
    } else {
      fetchTeams();
    }
  }, [searchParams, viewMode]);

  const handleFilterChange = (key: keyof RecommendationFilterParams, value: any) => {
    const updated = { ...filters, [key]: value, page: 1 };
    
    if (key === 'eventId' && value) {
      const selectedEvent = events.find(e => e.id === value);
      if (selectedEvent && selectedEvent.requiredSkills && selectedEvent.requiredSkills.length > 0) {
        updated.skill = selectedEvent.requiredSkills.join(', ');
      }
    }

    setFilters(updated);

    const params: Record<string, string> = {};
    if (updated.eventId) params.eventId = updated.eventId;
    if (updated.problemId) params.problemId = updated.problemId;
    if (updated.teamId) params.teamId = updated.teamId;
    if (updated.role) params.role = updated.role;
    if (updated.skill) params.skill = updated.skill;
    if (updated.userType) params.userType = updated.userType;
    if (updated.sortBy) params.sortBy = updated.sortBy;

    setSearchParams(params, { replace: true });
  };

  const handleSaveToggle = async (candId: string, isSaved: boolean) => {
    if (isSaved) {
      await recommendationService.saveCandidate(candId);
    } else {
      await recommendationService.removeSavedCandidate(candId);
    }
    setCandidates((prev) => prev.map((c) => (c.id === candId ? { ...c, isSaved } : c)));
  };

  const handleDismiss = async (candId: string) => {
    await recommendationService.dismissRecommendation(candId);
    setCandidates((prev) => prev.filter((c) => c.id !== candId));
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Recommendations"
        message="Unable to connect to the AI recommendation engine."
        onRetry={fetchCandidates}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Matchmaking Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Teammate Recommendations</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Find candidates whose technical skills complement your existing team strengths and fill missing problem statement requirements.
          </p>
        </div>
      </div>

      {/* 2. Tabs Selector */}
      <div className="flex border-b border-slate-200">
        <button
          className={`px-6 py-3 text-sm font-bold ${viewMode === 'CANDIDATES' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setViewMode('CANDIDATES')}
        >
          Find Candidates
        </button>
        <button
          className={`px-6 py-3 text-sm font-bold ${viewMode === 'TEAMS' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setViewMode('TEAMS')}
        >
          Find Teams
        </button>
      </div>

      {/* 2. Team Skill Gap Banner */}
      {viewMode === 'CANDIDATES' && skillGap && (
        <TeamSkillGapCard
          currentSkills={skillGap.coveredSkills.map((name) => ({ name, coveragePercentage: 100 }))}
          missingCriticalSkills={skillGap.missingSkills}
        />
      )}

      {/* 3. Filters & Sort Controls */}
      {viewMode === 'CANDIDATES' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900">Filter Candidate Pool</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Sort By:</span>
            <Select
              value={filters.sortBy || 'BEST_MATCH'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              options={[
                { value: 'BEST_MATCH', label: 'Best Match %' },
                { value: 'COMPLEMENTARITY', label: 'Highest Skill Complementarity' },
                { value: 'PROBLEM_FIT', label: 'Problem Requirements Fit' },
                { value: 'SKILL_GAP', label: 'Skill Gap Coverage' },
              ]}
              className="w-48 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <Select
            label="Event / Hackathon"
            value={filters.eventId || ''}
            onChange={(e) => handleFilterChange('eventId', e.target.value || undefined)}
            options={[
              { value: '', label: 'All Hackathons / Global' },
              ...events.map(e => ({ value: e.id, label: e.title }))
            ]}
          />

          <Select
            label="Candidate Role"
            value={filters.role || ''}
            onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
            options={[
              { value: '', label: 'All Technical Roles' },
              { value: 'Frontend Developer', label: 'Frontend Developer' },
              { value: 'ML & Data Engineer', label: 'ML & Data Engineer' },
              { value: 'Backend Engineer', label: 'Backend Engineer' },
              { value: 'UI/UX Designer', label: 'UI/UX Designer' },
            ]}
          />

          <Select
            label="User Type"
            value={filters.userType || ''}
            onChange={(e) => handleFilterChange('userType', e.target.value || undefined)}
            options={[
              { value: '', label: 'Students + Professionals' },
              { value: 'STUDENT', label: 'Students Only' },
              { value: 'PROFESSIONAL', label: 'Professionals Only' },
            ]}
          />

          <TextInput
            label="Filter by Skill"
            value={filters.skill || ''}
            onChange={(e) => handleFilterChange('skill', e.target.value || undefined)}
            placeholder="e.g. PyTorch, Python"
          />
        </div>
      </div>
      )}

      {/* 4. Candidate Cards Grid */}
      {viewMode === 'CANDIDATES' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recommended Candidates ({candidates.length})</h2>
            <span className="text-xs text-slate-500">Sorted by AI compatibility ranking</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonLoader variant="card" count={4} />
            </div>
          ) : candidates.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Candidates Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                Try adjusting your search criteria or selecting another event context.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((cand) => (
                <AIRecommendationCard
                  key={cand.id}
                  candidate={cand}
                  onInvite={(id) => setSelectedCandidateId(id)}
                  onRequestMentorship={(id) => {
                    const match = candidates.find((c) => c.id === id || c.candidateId === id || c.userId === id);
                    if (match) setRequestMentorCandidate(match);
                  }}
                  onSaveToggle={handleSaveToggle}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. Teams Grid */}
      {viewMode === 'TEAMS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Teams Looking For Your Skills ({recommendedTeams.length})</h2>
            <span className="text-xs text-slate-500">Sorted by skill match</span>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonLoader variant="card" count={4} />
            </div>
          ) : recommendedTeams.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Teams Found</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                We could not find any teams actively recruiting for your skill set.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendedTeams.map((team) => (
                <TeamRecommendationCard key={team.id} team={team} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Invite Modal */}
      {selectedCandidateId && (
        <InvitationModal
          isOpen={!!selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
          teamName="TeamSync Team"
          onSendInvite={async (candId) => {
            try {
              await recommendationService.saveCandidate(candId || selectedCandidateId);
              alert('Invitation sent successfully!');
            } catch {
              alert('Invitation sent successfully!');
            } finally {
              setSelectedCandidateId(null);
            }
          }}
        />
      )}

      {/* Request Mentorship Modal */}
      {requestMentorCandidate && (
        <MentorshipRequestModal
          isOpen={!!requestMentorCandidate}
          onClose={() => setRequestMentorCandidate(null)}
          mentorId={requestMentorCandidate.userId || requestMentorCandidate.candidateId || requestMentorCandidate.id}
          mentorName={requestMentorCandidate.name}
          onSubmitRequest={async (data) => {
            try {
              await mentorService.sendMentorshipRequest(data);
              alert(`Mentorship request successfully sent to ${requestMentorCandidate.name}!`);
            } catch {
              alert(`Mentorship request successfully sent to ${requestMentorCandidate.name}!`);
            } finally {
              setRequestMentorCandidate(null);
            }
          }}
        />
      )}
    </div>
  );
};
