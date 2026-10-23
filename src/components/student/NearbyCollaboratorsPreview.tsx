import React from 'react';
import { NearbyPerson } from '@/services/api/studentService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { MapPin, Navigation, ShieldCheck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface NearbyCollaboratorsPreviewProps {
  nearbyPeople?: NearbyPerson[];
  locationAllowed?: boolean;
  onEnableLocation?: () => void;
}

export const NearbyCollaboratorsPreview: React.FC<NearbyCollaboratorsPreviewProps> = ({
  nearbyPeople = [
    { id: 'n_01', name: 'Liam Chen', role: 'STUDENT', skills: ['React', 'Tailwind'], distanceKm: 2.4, approximateArea: 'Stanford Campus Area' },
    { id: 'n_02', name: 'Priya Sharma', role: 'PROFESSIONAL', skills: ['System Design', 'Python'], distanceKm: 5.8, approximateArea: 'Palo Alto Tech Park' },
    { id: 'n_03', name: 'Maya Lin', role: 'STUDENT', skills: ['UI/UX', 'Figma'], distanceKm: 8.1, approximateArea: 'Mountain View' },
  ],
  locationAllowed = true,
  onEnableLocation,
}) => {
  if (!locationAllowed) {
    return (
      <Card className="bg-slate-50 border-slate-200 p-6 text-center text-left">
        <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <MapPin className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900 mb-1">Location Discovery is Disabled</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
          Allow approximate location discovery to discover nearby teammates, local hackathons, and mentors in your area. Exact addresses are never shared.
        </p>
        {onEnableLocation && (
          <Button size="sm" onClick={onEnableLocation} leftIcon={<Navigation className="w-4 h-4" />}>
            Enable Location Discovery
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900">People Near You</h3>
          </div>
          <p className="text-xs text-slate-500">Discover collaborators in your campus or local area</p>
        </div>
        <Link
          to="/student/nearby"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          <span>Explore Nearby</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Placeholder */}
        <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between min-h-[160px] relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="relative z-10 flex items-center justify-between">
            <Badge variant="primary">Map Preview</Badge>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Approximate Distance
            </span>
          </div>

          <div className="relative z-10 text-center py-4">
            <Navigation className="w-8 h-8 text-brand-600 mx-auto mb-1 animate-pulse" />
            <p className="text-xs font-semibold text-slate-800">OpenStreetMap Integration</p>
            <p className="text-[11px] text-slate-500">3 Collaborators found within 10 km</p>
          </div>
        </div>

        {/* Nearby People List */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nearbyPeople.map((person) => (
            <Card key={person.id} hoverable className="p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-bold text-brand-700">{person.distanceKm} km</span>
                  <Badge variant={person.role === 'STUDENT' ? 'primary' : 'outline'}>{person.role}</Badge>
                </div>
                <h5 className="text-xs font-bold text-slate-900">{person.name}</h5>
                <p className="text-[11px] text-slate-500 mb-2 truncate">{person.approximateArea}</p>

                <div className="flex flex-wrap gap-1 mb-2">
                  {person.skills.map((s) => (
                    <SkillBadge key={s} skill={s} />
                  ))}
                </div>
              </div>

              <button
                onClick={() => alert(`Connect with ${person.name}`)}
                className="text-[11px] font-semibold text-brand-600 hover:underline text-left pt-1 border-t border-slate-100"
              >
                Connect →
              </button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
