import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, Event } from '@/services/api/eventService';
import { EventHeader } from '@/components/events/EventHeader';
import { ProblemStatementCard } from '@/components/events/ProblemStatementCard';
import { EventTimeline } from '@/components/events/EventTimeline';
import { EventPrizes } from '@/components/events/EventPrizes';
import { EventEligibilityCard } from '@/components/events/EventEligibilityCard';
import { EventOrganizerSection } from '@/components/events/EventOrganizerSection';
import { EventParticipantPreview } from '@/components/events/EventParticipantPreview';
import { AiTeamMatchingBanner } from '@/components/events/AiTeamMatchingBanner';
import { Card, SkillBadge } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Code2, Users, HelpCircle } from 'lucide-react';

export const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        if (!eventId) return;
        const response = await eventService.getEventById(eventId);
        if (response.success && response.data) {
          setEvent(response.data);
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);



  if (isLoading) {
    return (
      <div className="space-y-6 text-left">
        <SkeletonLoader variant="card" count={1} className="h-48" />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <ErrorState
        title="Event Not Found"
        message="The event you requested could not be found or has been removed."
        onRetry={() => navigate('/events')}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Back Button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Event Discovery
        </Link>
      </div>

      {/* 1. Dynamic Event Header */}
      <EventHeader event={event} />

      {/* 2. AI Team Matching Banner */}
      <AiTeamMatchingBanner eventId={event.id} />

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Event */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">About the Event</h3>
            <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          </Card>

          {/* Problem Statements */}
          {event.problemStatements && event.problemStatements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Problem Statements ({event.problemStatements.length})</h3>
                  <p className="text-xs text-slate-500">Select a problem statement to view requirements or find a matching team</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.problemStatements.map((prob) => (
                  <ProblemStatementCard key={prob.id} problem={prob} eventId={event.id} />
                ))}
              </div>
            </div>
          )}

          {/* Required Skills & Domain */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills & Technologies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.requiredSkills.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </Card>

          {/* Prizes Section */}
          <EventPrizes prizes={event.prizes} />

          {/* FAQ Section */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-1">Can I participate individually without a team?</h4>
                <p className="text-slate-600">Yes! You can register individually and use our AI Team Matching engine to join open teams before the submission deadline.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-1">Are cross-college and cross-department teams allowed?</h4>
                <p className="text-slate-600">Absolutely! TeamForge AI encourages cross-college collaboration to pair complementary technical strengths.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Timeline, Eligibility, Organizer, Participants */}
        <div className="space-y-6">
          {/* Eligibility Card */}
          <EventEligibilityCard eligibilityType={event.eligibilityType} eligibilityNotes={event.eligibilityNotes} />

          {/* Team Requirements Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-accent-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Team Composition</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Min Members</span>
                <span className="font-bold text-slate-900">{event.minTeamSize}</span>
              </div>
              <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Max Members</span>
                <span className="font-bold text-slate-900">{event.maxTeamSize}</span>
              </div>
            </div>
          </Card>

          {/* Timeline Schedule */}
          <EventTimeline timeline={event.timeline} />

          {/* Participant Demographics */}
          <EventParticipantPreview stats={event.participantStats} />

          {/* Organizer Info */}
          <EventOrganizerSection organizer={event.organizer} />
        </div>
      </div>
    </div>
  );
};
