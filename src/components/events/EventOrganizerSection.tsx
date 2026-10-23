import React from 'react';
import { EventOrganizer } from '@/services/api/eventService';
import { Card, Avatar } from '@/components/ui/Cards';
import { Building2, Globe, Mail } from 'lucide-react';

export interface EventOrganizerSectionProps {
  organizer: EventOrganizer;
  className?: string;
}

export const EventOrganizerSection: React.FC<EventOrganizerSectionProps> = ({ organizer, className }) => {
  return (
    <Card className={`text-left ${className}`}>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Event Organizer</h3>

      <div className="flex items-center gap-4">
        <Avatar name={organizer.name} src={organizer.logoUrl} size="lg" />
        <div className="space-y-0.5 text-xs">
          <h4 className="font-bold text-slate-900 text-sm">{organizer.name}</h4>
          <p className="text-slate-500 font-medium flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" /> {organizer.organization} • {organizer.type}
          </p>

          <div className="flex items-center gap-3 pt-1">
            {organizer.website && (
              <a
                href={organizer.website}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {organizer.contactEmail && (
              <a
                href={`mailto:${organizer.contactEmail}`}
                className="text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-semibold"
              >
                <Mail className="w-3.5 h-3.5" /> Contact
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
