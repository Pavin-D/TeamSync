import React, { useState } from 'react';
import { Event } from '@/services/api/eventService';
import { Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Calendar, MapPin, Globe, Users, Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EventCardProps {
  event: Event;
  onSaveToggle?: (eventId: string, isSaved: boolean) => void;
  className?: string;us
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSaveToggle, className }) => {
  const navigate = useNavigate();
  const [isSavedState, setIsSavedState] = useState(event.isSaved || false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newSaved = !isSavedState;
    setIsSavedState(newSaved);
    if (onSaveToggle) onSaveToggle(event.id, newSaved);
  };

  const getStatusBadge = (status: Event['status']) => {
    switch (status) {
      case 'REGISTRATION_OPEN':
        return <Badge variant="success">Registration Open</Badge>;
      case 'CLOSING_SOON':
        return <Badge variant="warning">Closing Soon</Badge>;
      case 'ONGOING':
        return <Badge variant="primary">Ongoing</Badge>;
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const getScopeBadge = (scope: Event['scope']) => {
    const scopeLabels: Record<Event['scope'], string> = {
      COLLEGE: 'College Event',
      DEPARTMENT: 'Department Event',
      INTER_COLLEGE: 'Inter-College',
      NATIONAL: 'National',
      GLOBAL: 'Global',
    };
    return (
      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
        {scopeLabels[scope] || scope}
      </span>
    );
  };

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className={`bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card hover:shadow-popover transition duration-200 flex flex-col justify-between cursor-pointer text-left ${className}`}
    >
      <div>
        {/* Header & Badges */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(event.status)}
            {getScopeBadge(event.scope)}
          </div>

          <button
            type="button"
            onClick={handleSaveClick}
            className={`p-1.5 rounded-xl border transition ${
              isSavedState
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500'
            }`}
            aria-label={isSavedState ? 'Remove from saved' : 'Save event'}
          >
            <Heart className={`w-4 h-4 ${isSavedState ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Organizer */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition mb-1 leading-snug">
          {event.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3 font-medium">{event.organizer.name}</p>

        {/* Meta details */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            <span>
              {event.startDate} – {event.endDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {event.mode === 'ONLINE' ? (
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            )}
            <span>
              {event.mode} • {[event.locationCity, event.locationState, event.locationCountry].filter(Boolean).join(', ') || 'Online'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-accent-600 shrink-0" />
            <span>
              Team Size: {event.minTeamSize}–{event.maxTeamSize} members
            </span>
          </div>
        </div>

        {/* Required Skills */}
        {event.requiredSkills && event.requiredSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Required Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {event.requiredSkills.slice(0, 4).map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
              {event.requiredSkills.length > 4 && (
                <span className="text-[11px] text-slate-400 self-center">+{event.requiredSkills.length - 4} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action CTAs */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Button
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event.id}`);
          }}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          View Event
        </Button>
        <SecondaryButton
          size="sm"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/events/${event.id}/find-team`);
          }}
        >
          Find Team
        </SecondaryButton>
      </div>
    </div>
  );
};
