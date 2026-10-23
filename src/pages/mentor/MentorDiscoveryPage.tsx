import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mentorService, MentorProfile, MentorFilterParams } from '@/services/api/mentorService';
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters } from '@/components/mentor/MentorFilters';
import { MentorshipRequestModal } from '@/components/mentor/MentorshipRequestModal';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Sparkles, Users, Award } from 'lucide-react';

export const MentorDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<MentorFilterParams>({
    expertise: searchParams.get('expertise') || undefined,
    experienceYears: searchParams.get('experienceYears') || undefined,
    availability: searchParams.get('availability') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'BEST_MATCH',
  });

  const [recommendedMentors, setRecommendedMentors] = useState<MentorProfile[]>([]);
  const [allMentors, setAllMentors] = useState<MentorProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Request modal state
  const [selectedMentor, setSelectedMentor] = useState<{ id: string; name: string } | null>(null);

  const fetchMentorsData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await mentorService.getMentors(filters);

      if (res.success && res.data) {
        setAllMentors(res.data);
        setRecommendedMentors(res.data.slice(0, 2));
      } else {
        setRecommendedMentors([]);
        setAllMentors([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorsData();
  }, [searchParams]);

  const handleFilterChange = (key: keyof MentorFilterParams, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const params: Record<string, string> = {};
    if (updated.expertise) params.expertise = updated.expertise;
    if (updated.experienceYears) params.experienceYears = updated.experienceYears;
    if (updated.availability) params.availability = updated.availability;
    if (updated.search) params.search = updated.search;

    setSearchParams(params, { replace: true });
  };

  const handleResetFilters = () => {
    setFilters({ sortBy: 'BEST_MATCH' });
    setSearchParams({}, { replace: true });
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Mentors"
        message="Unable to connect to the mentorship discovery service."
        onRetry={fetchMentorsData}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Work Professional Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Connect with Work Professionals</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Connect with experienced working professionals for technical architecture reviews, hackathon guidance, and career development.
          </p>
        </div>
      </div>

      {/* 2. Reusable Filter Drawer */}
      <MentorFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. AI Recommended Work Professionals Section */}
      {recommendedMentors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">AI Recommended Work Professionals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedMentors.map((m) => (
              <MentorCard
                key={m.id}
                mentor={m}
                onRequestMentorship={(id) => setSelectedMentor({ id, name: m.name })}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. All Work Professionals Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Verified Work Professionals ({allMentors.length})</h2>
          <span className="text-xs text-slate-500">Showing available industry professionals</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonLoader variant="card" count={4} />
          </div>
        ) : allMentors.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Mentors Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              We couldn't find any mentors matching your search query or filter options.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold hover:bg-brand-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allMentors.map((m) => (
              <MentorCard
                key={m.id}
                mentor={m}
                onRequestMentorship={(id) => setSelectedMentor({ id, name: m.name })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedMentor && (
        <MentorshipRequestModal
          isOpen={!!selectedMentor}
          onClose={() => setSelectedMentor(null)}
          mentorId={selectedMentor.id}
          mentorName={selectedMentor.name}
          onSubmitRequest={async (data) => {
            await mentorService.sendMentorshipRequest(data);
          }}
        />
      )}
    </div>
  );
};
