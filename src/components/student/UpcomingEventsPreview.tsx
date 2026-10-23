import React from 'react';
import { UpcomingEvent } from '@/services/api/studentService';
import { Event } from '@/services/api/eventService';
import { EventCard } from '@/components/events/EventCard';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface UpcomingEventsPreviewProps {
  events?: UpcomingEvent[];
}

export const UpcomingEventsPreview: React.FC<UpcomingEventsPreviewProps> = ({ events }) => {
  const mappedEvents: Event[] = events
    ? events.map((e) => ({
        id: e.id,
        title: e.name,
        description: `Organized by ${e.organizer}`,
        organizer: { name: e.organizer, organization: 'Partner Institution', type: 'ORGANIZATION' },
        status: e.status,
        scope: 'GLOBAL',
        mode: e.isOnline ? 'ONLINE' : 'OFFLINE',
        eligibilityType: 'STUDENTS_AND_PROFESSIONALS',
        startDate: e.startDate,
        endDate: e.endDate,
        registrationDeadline: e.registrationDeadline,
        registrationClosingTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        locationCity: e.location,
        domain: 'AI & Web Development',
        minTeamSize: e.minTeamSize,
        maxTeamSize: e.maxTeamSize,
        requiredSkills: e.requiredSkills,
        prizes: [{ title: '1st Place', reward: '₹1,00,000', type: 'CASH' }],
        timeline: [],
        problemStatements: [],
        participantStats: { totalRegistered: e.participantCount, studentsCount: e.participantCount, professionalsCount: 0, collegesRepresented: 10 },
      }))
    : getFallbackEvents();

  function getFallbackEvents(): Event[] {
    return [
      {
        id: 'evt_01',
        title: 'AI Innovation Hackathon 2026',
        description: 'Build next-gen artificial intelligence & LLM solutions',
        organizer: { name: 'Stanford AI Club', organization: 'Stanford University', type: 'COLLEGE' },
        status: 'REGISTRATION_OPEN',
        scope: 'GLOBAL',
        mode: 'ONLINE',
        eligibilityType: 'STUDENTS_AND_PROFESSIONALS',
        startDate: 'Aug 20',
        endDate: 'Aug 25',
        registrationDeadline: 'Aug 18',
        registrationClosingTimestamp: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
        locationCity: 'San Francisco',
        domain: 'AI / ML',
        minTeamSize: 2,
        maxTeamSize: 5,
        requiredSkills: ['AI', 'React', 'Python'],
        prizes: [{ title: '1st Place', reward: '₹1,00,000', type: 'CASH' }],
        timeline: [],
        problemStatements: [],
        participantStats: { totalRegistered: 420, studentsCount: 380, professionalsCount: 40, collegesRepresented: 22 },
      },
      {
        id: 'evt_02',
        title: 'Global Web3 & FinTech Challenge',
        description: 'DeFi, Smart Contracts, and Next-Gen Payment Infrastructures',
        organizer: { name: 'MIT Technology Review', organization: 'MIT', type: 'COLLEGE' },
        status: 'CLOSING_SOON',
        scope: 'NATIONAL',
        mode: 'HYBRID',
        eligibilityType: 'STUDENTS',
        startDate: 'Sep 05',
        endDate: 'Sep 08',
        registrationDeadline: 'Sep 01',
        registrationClosingTimestamp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        locationCity: 'Boston, MA',
        domain: 'Blockchain',
        minTeamSize: 3,
        maxTeamSize: 4,
        requiredSkills: ['Solidity', 'TypeScript', 'Node.js'],
        prizes: [{ title: '1st Place', reward: '$10,000', type: 'CASH' }],
        timeline: [],
        problemStatements: [],
        participantStats: { totalRegistered: 280, studentsCount: 280, professionalsCount: 0, collegesRepresented: 15 },
      },
    ];
  }

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Upcoming Hackathons & Events</h3>
          <p className="text-xs text-slate-500">Discover events matching your skill set and form a winning team</p>
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition"
        >
          <span>View All Events</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mappedEvents.map((evt) => (
          <EventCard key={evt.id} event={evt} />
        ))}
      </div>
    </div>
  );
};
