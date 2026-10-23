import React, { useState } from 'react';
import { Event } from '@/services/api/eventService';
import { Badge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { EventCountdown } from './EventCountdown';
import { Calendar, MapPin, Globe, Users, Heart, Share2, UserCheck, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EventHeaderProps {
  event: Event;
  onRegister?: () => void;
  onSaveToggle?: (isSaved: boolean) => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({ event, onRegister, onSaveToggle }) => {
  const navigate = useNavigate();
  const [isSavedState, setIsSavedState] = useState(event.isSaved || false);
  const [userRegState, setUserRegState] = useState(event.userRegistrationStatus || 'NOT_REGISTERED');
  const [shareCopied, setShareCopied] = useState(false);

  const handleSave = () => {
    const next = !isSavedState;
    setIsSavedState(next);
    if (onSaveToggle) onSaveToggle(next);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const handleRegisterClick = () => {
    setUserRegState('REGISTERED');
    if (onRegister) onRegister();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-modal text-left space-y-6">
      {/* Top Bar: Badges + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={event.status === 'REGISTRATION_OPEN' ? 'success' : 'primary'}>
            {event.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline">{event.scope.replace('_', ' ')} Scope</Badge>
          <Badge variant="default">{event.mode}</Badge>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition ${
              isSavedState
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSavedState ? 'fill-current' : ''}`} />
            <span>{isSavedState ? 'Saved' : 'Save Event'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>{shareCopied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {event.title}
          </h1>

          {event.tagline && <p className="text-sm font-semibold text-brand-600">{event.tagline}</p>}

          <p className="text-xs text-slate-500 font-medium">Organized by {event.organizer.name}</p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>
                <strong>Dates:</strong> {event.startDate} – {event.endDate}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {event.mode === 'ONLINE' ? (
                <Globe className="w-4 h-4 text-emerald-600" />
              ) : (
                <MapPin className="w-4 h-4 text-brand-600" />
              )}
              <span>
                <strong>Location:</strong> {[event.locationCity, event.locationState].filter(Boolean).join(', ') || 'Online Virtual'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-accent-600" />
              <span>
                <strong>Team Size:</strong> {event.minTeamSize}–{event.maxTeamSize} Members
              </span>
            </div>
          </div>
        </div>

        {/* Countdown & Quick Action */}
        <div className="space-y-4">
          <EventCountdown targetTimestamp={event.registrationClosingTimestamp} />

          {userRegState === 'NOT_REGISTERED' ? (
            <Button onClick={handleRegisterClick} size="lg" fullWidth leftIcon={<UserCheck className="w-5 h-5" />}>
              Register for Event
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>You are Registered for this Event!</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => navigate(`/events/${event.id}/find-team`)}>
                  Find Team
                </Button>
                <SecondaryButton size="sm" onClick={() => navigate(`/events/${event.id}/create-team`)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Create Team
                </SecondaryButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
