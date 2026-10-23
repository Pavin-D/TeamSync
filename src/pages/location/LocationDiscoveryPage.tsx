import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  locationService,
  NearbyPerson,
  NearbyTeamItem,
  LocationSearchParams,
} from '@/services/api/locationService';
import { geolocationService } from '@/services/api/geolocationService';
import { NearbyMap } from '@/components/location/NearbyMap';
import { MapLegend } from '@/components/location/MapLegend';
import { LocationSelectorModal } from '@/components/location/LocationSelectorModal';
import { RadiusFilterControl } from '@/components/location/RadiusFilterControl';
import { NearbyPersonCard } from '@/components/location/NearbyPersonCard';
import { TeamCard } from '@/components/teams/TeamCard';
import { InvitationModal } from '@/components/teams/InvitationModal';
import { Select, TextInput } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { MapPin, Users, Map as MapIcon, List as ListIcon } from 'lucide-react';

export const LocationDiscoveryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Mode toggles
  const [activeTab, setActiveTab] = useState<'PEOPLE' | 'TEAMS'>('PEOPLE');
  const [viewMode, setViewMode] = useState<'SPLIT' | 'MAP_ONLY' | 'LIST_ONLY'>('SPLIT');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // User approximate location state
  const [userLocation, setUserLocation] = useState({
    city: 'Chennai',
    area: 'Chennai, Tamil Nadu',
    lat: 13.08,
    lng: 80.27,
  });

  // Filter params
  const [radiusKm, setRadiusKm] = useState<number>(
    parseInt(searchParams.get('radius') || '10', 10)
  );
  const [filters, setFilters] = useState<LocationSearchParams>({
    userType: (searchParams.get('userType') as any) || 'ALL',
    role: searchParams.get('role') || undefined,
    skill: searchParams.get('skill') || undefined,
    eventId: searchParams.get('eventId') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'MATCH',
  });

  const [people, setPeople] = useState<NearbyPerson[]>([]);
  const [teams, setTeams] = useState<NearbyTeamItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Invite modal state
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Request user GPS location on component mount if permission granted
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const pos = await geolocationService.getCurrentPosition();
        const city = pos.approximateCity || 'Chennai';
        const area = pos.approximateArea || 'Chennai, Tamil Nadu';
        setUserLocation({ city, area, lat: pos.latitude, lng: pos.longitude });
        try {
          await locationService.updateLocationPreferences({ latitude: pos.latitude, longitude: pos.longitude, city, area });
        } catch {
          // Silently handle
        }
      } catch (err) {
        // Fallback to IP-based location if GPS is denied/unavailable
        try {
          const ipRes = await fetch('https://freeipapi.com/api/json');
          if (ipRes.ok) {
            const ipData = await ipRes.json();
            const city = ipData.cityName || 'Unknown';
            const area = ipData.regionName ? `${city}, ${ipData.regionName}` : city;
            setUserLocation({ city, area, lat: ipData.latitude, lng: ipData.longitude });
            await locationService.updateLocationPreferences({ latitude: ipData.latitude, longitude: ipData.longitude, city, area });
            return;
          }
        } catch (ipErr) {
          // Ignore IP fetch errors
        }

        // Fallback to fetching their saved profile location if IP fails
        try {
          const prefs = await locationService.getMyLocationPreferences();
          if (prefs.success && prefs.data && prefs.data.city && prefs.data.city !== 'Chennai') {
            setUserLocation({
              city: prefs.data.city,
              area: prefs.data.area || prefs.data.city,
              lat: prefs.data.latitude || 13.08,
              lng: prefs.data.longitude || 80.27,
            });
          }
        } catch {
          // Silently handle completely
        }
      }
    };
    fetchLocation();
  }, []);

  const fetchNearbyData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [peopleRes, teamsRes] = await Promise.all([
        locationService.searchNearbyPeople({ ...filters, radiusKm, city: userLocation.city }),
        locationService.searchNearbyTeams({ ...filters, radiusKm, city: userLocation.city }),
      ]);

      if (peopleRes.success && peopleRes.data) {
        setPeople(peopleRes.data);
      } else {
        setPeople([]);
      }

      if (teamsRes.success && teamsRes.data) {
        setTeams(teamsRes.data);
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
    fetchNearbyData();
  }, [radiusKm, userLocation.city, searchParams]);

  const handleFilterChange = (key: keyof LocationSearchParams, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    const params: Record<string, string> = { radius: String(radiusKm) };
    if (updated.userType && updated.userType !== 'ALL') params.userType = updated.userType;
    if (updated.role) params.role = updated.role;
    if (updated.skill) params.skill = updated.skill;
    if (updated.sortBy) params.sortBy = updated.sortBy;

    setSearchParams(params, { replace: true });
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Location Data"
        message="Unable to connect to the location discovery service."
        onRetry={fetchNearbyData}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16">
      {/* 1. Top Location Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-slate-900">Nearby Discovery & Radius Search</h1>
          </div>
          <p className="text-xs text-slate-500">
            Discover students, working professionals, and recruiting teams near your approximate area.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-2xl flex items-center gap-2 text-xs font-semibold text-slate-800 border border-slate-200">
            <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
            <span>{userLocation.area}</span>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-brand-600 hover:underline font-bold ml-1 text-xs"
            >
              Change
            </button>
          </div>
        </div>
      </div>

      {/* 2. Controls & Filter Panel */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* People / Teams Tab Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('PEOPLE')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'PEOPLE' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nearby People ({people.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('TEAMS')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'TEAMS' ? 'bg-white text-slate-900 shadow-subtle' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Nearby Teams ({teams.length})
            </button>
          </div>

          {/* Radius Selector */}
          <RadiusFilterControl radiusKm={radiusKm} onChangeRadius={(r) => setRadiusKm(r)} />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('SPLIT')}
              className={`p-2 rounded-xl text-xs font-semibold border transition ${
                viewMode === 'SPLIT' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Split View"
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('MAP_ONLY')}
              className={`p-2 rounded-xl text-xs font-semibold border transition ${
                viewMode === 'MAP_ONLY' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="Map Only"
            >
              <MapIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('LIST_ONLY')}
              className={`p-2 rounded-xl text-xs font-semibold border transition ${
                viewMode === 'LIST_ONLY' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              title="List Only"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <Select
            label="User Type"
            value={filters.userType || 'ALL'}
            onChange={(e) => handleFilterChange('userType', e.target.value)}
            options={[
              { value: 'ALL', label: 'Students + Professionals' },
              { value: 'STUDENT', label: 'Students Only' },
              { value: 'PROFESSIONAL', label: 'Professionals Only' },
            ]}
          />

          <TextInput
            label="Filter by Technical Skill"
            value={filters.skill || ''}
            onChange={(e) => handleFilterChange('skill', e.target.value || undefined)}
            placeholder="e.g. Python, PyTorch"
          />

          <Select
            label="Sort By"
            value={filters.sortBy || 'MATCH'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            options={[
              { value: 'MATCH', label: 'Best AI Match %' },
              { value: 'DISTANCE', label: 'Nearest Distance' },
              { value: 'COMPLEMENTARITY', label: 'Highest Skill Complementarity' },
            ]}
          />

          <div className="flex items-end">
            <MapLegend />
          </div>
        </div>
      </div>

      {/* 3. Main Split View Grid */}
      <div
        className={`grid gap-6 items-start ${
          viewMode === 'SPLIT' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}
      >
        {/* OpenStreetMap Visual Canvas */}
        {viewMode !== 'LIST_ONLY' && (
          <div className={viewMode === 'SPLIT' ? 'lg:col-span-6' : 'w-full'}>
            <NearbyMap
              userCenter={{ lat: userLocation.lat, lng: userLocation.lng }}
              radiusKm={radiusKm}
              people={activeTab === 'PEOPLE' ? people : []}
              teams={activeTab === 'TEAMS' ? teams : []}
              selectedId={selectedId}
              onSelectMarker={(id) => setSelectedId(id)}
              onSelectProfile={(id) => navigate(`/recommendations/${id}`)}
            />
          </div>
        )}

        {/* Results List */}
        {viewMode !== 'MAP_ONLY' && (
          <div className={viewMode === 'SPLIT' ? 'lg:col-span-6 space-y-4' : 'w-full space-y-4'}>
            {isLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : activeTab === 'PEOPLE' ? (
              people.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
                  <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-slate-900 mb-1">No Nearby Candidates Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Try expanding your search radius to 20 km or 50 km to discover more collaborators.
                  </p>
                  <Button size="sm" onClick={() => setRadiusKm(50)}>
                    Expand Radius to 50 km
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {people.map((p) => (
                    <NearbyPersonCard
                      key={p.id}
                      person={p}
                      isSelected={selectedId === p.id}
                      onSelect={() => setSelectedId(p.id)}
                      onInvite={(id) => setSelectedCandidateId(id)}
                    />
                  ))}
                </div>
              )
            ) : teams.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Nearby Recruiting Teams</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  No recruiting teams currently active within {radiusKm} km.
                </p>
                <Button size="sm" onClick={() => setRadiusKm(50)}>
                  Expand Radius to 50 km
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((item) => (
                  <div key={item.team.id} className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between px-1">
                      <span>Approx. {item.distanceKm} km away</span>
                      <span>{item.approximateArea || item.team.name}</span>
                    </div>
                    <TeamCard team={item.team} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={async (city, area) => {
          setUserLocation({ city, area, lat: 13.08, lng: 80.27 });
          try {
            await locationService.updateManualLocation(city, area);
          } catch {
            // Handled
          }
        }}
      />

      {/* Candidate Invite Modal */}
      {selectedCandidateId && (
        <InvitationModal
          isOpen={!!selectedCandidateId}
          onClose={() => setSelectedCandidateId(null)}
          teamName="TeamSync Team"
          onSendInvite={async () => {
            setSelectedCandidateId(null);
          }}
        />
      )}
    </div>
  );
};
