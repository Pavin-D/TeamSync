import React, { useState, useEffect } from 'react';
import { eventService, Event } from '@/services/api/eventService';
import { EventCard } from '@/components/events/EventCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { Heart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SavedEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setIsLoading(true);
      try {
        const res = await eventService.getSavedEvents();
        setEvents(res.data || []);
      } catch {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Heart className="w-6 h-6 text-rose-500 fill-current" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Saved Events</h1>
          <p className="text-xs text-slate-500">Your bookmarked hackathons and competitions for quick access</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Saved Events Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Bookmark events as you browse to save them to your personal shortlist.
          </p>
          <Button onClick={() => navigate('/events')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Discover Events
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
};
