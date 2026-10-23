import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService, Event, EventFilterParams } from '@/services/api/eventService';
import { EventCard } from '@/components/events/EventCard';
import { EventFilters } from '@/components/events/EventFilters';
import { Select } from '@/components/ui/Inputs';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Search, Sparkles, Trophy, SlidersHorizontal } from 'lucide-react';

export const EventDiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State derived from URL search parameters
  const [filters, setFilters] = useState<EventFilterParams>({
    search: searchParams.get('search') || '',
    scope: (searchParams.get('scope') as any) || undefined,
    mode: (searchParams.get('mode') as any) || undefined,
    domain: searchParams.get('domain') || undefined,
    status: (searchParams.get('status') as any) || undefined,
    teamSize: searchParams.get('teamSize') || undefined,
    city: searchParams.get('city') || undefined,
    sortBy: searchParams.get('sortBy') || 'RECOMMENDED',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [events, setEvents] = useState<Event[]>([]);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Sync filters object to URL query parameters
  const updateUrlParams = (newFilters: EventFilterParams) => {
    const params: Record<string, string> = {};
    if (newFilters.search) params.search = newFilters.search;
    if (newFilters.scope) params.scope = newFilters.scope;
    if (newFilters.mode) params.mode = newFilters.mode;
    if (newFilters.domain) params.domain = newFilters.domain;
    if (newFilters.status) params.status = newFilters.status;
    if (newFilters.teamSize) params.teamSize = newFilters.teamSize;
    if (newFilters.city) params.city = newFilters.city;
    if (newFilters.sortBy) params.sortBy = newFilters.sortBy;
    if (newFilters.page && newFilters.page > 1) params.page = String(newFilters.page);

    setSearchParams(params, { replace: true });
  };

  const fetchEventsData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [eventsRes, featuredRes] = await Promise.all([
        eventService.getEvents(filters),
        eventService.getFeaturedEvents(),
      ]);

      if (eventsRes.success && eventsRes.data) {
        setEvents(eventsRes.data);
      } else {
        setEvents([]);
      }

      if (featuredRes.success && featuredRes.data) {
        setFeaturedEvents(featuredRes.data);
      } else {
        setFeaturedEvents([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsData();
  }, [searchParams]);

  const handleFilterChange = (key: keyof EventFilterParams, value: any) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);
    updateUrlParams(updated);
  };

  const handleResetFilters = () => {
    const reset: EventFilterParams = { search: '', sortBy: 'RECOMMENDED', page: 1 };
    setFilters(reset);
    setSearchParams({}, { replace: true });
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Events"
        message="Unable to connect to the event discovery API."
        onRetry={fetchEventsData}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-12">
      {/* 1. Header Banner & Search */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hackathon & Event Discovery Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Discover Events & Hackathons
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Find college, national, and global competitions. Form winning teams with compatible student developers and mentors.
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by event name, skill, technology, domain, or college..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 backdrop-blur-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reusable Event Filter Drawer / Panel */}
      <EventFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* 3. Featured Events Hero Section */}
      {featuredEvents.length > 0 && !filters.search && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Featured Hackathons</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredEvents.map((evt) => (
              <EventCard key={`featured_${evt.id}`} event={evt} className="border-brand-200/80 shadow-md bg-gradient-to-b from-white to-slate-50/50" />
            ))}
          </div>
        </div>
      )}

      {/* 4. All Events Header & Sort Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">All Competitions & Events</h2>
            <p className="text-xs text-slate-500">
              Showing {events.length} event{events.length === 1 ? '' : 's'}
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
                { value: 'NEWEST', label: 'Newest Added' },
                { value: 'DEADLINE', label: 'Registration Deadline' },
                { value: 'STARTING_SOON', label: 'Starting Soon' },
                { value: 'POPULAR', label: 'Most Participants' },
              ]}
              className="w-48 text-xs"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" count={6} />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-6">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              We couldn't find any events matching your search criteria or filters. Try adjusting your search query or reset filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
