import React, { useState, useEffect } from 'react';
import { eventService, Event } from '@/services/api/eventService';
import { EventCard } from '@/components/events/EventCard';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Button } from '@/components/ui/Button';
import { Calendar, Heart, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'REGISTERED' | 'ONGOING' | 'COMPLETED' | 'SAVED'>('REGISTERED');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsLoading(true);
      try {
        if (activeTab === 'SAVED') {
          const res = await eventService.getSavedEvents();
          setEvents(res.data || []);
        } else {
          const res = await eventService.getRegisteredEvents();
          setEvents(res.data || []);
        }
      } catch {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEvents();
  }, [activeTab]);

  return (
    <div className="space-y-6 text-left pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Events & Hackathons</h1>
        <p className="text-xs text-slate-500">Track competitions you're registered for, ongoing hackathons, and bookmarked events</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('REGISTERED')}
          className={`pb-3 flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'REGISTERED' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" /> Registered Events
        </button>

        <button
          onClick={() => setActiveTab('ONGOING')}
          className={`pb-3 flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'ONGOING' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Trophy className="w-4 h-4" /> Ongoing
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`pb-3 flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'COMPLETED' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Completed
        </button>

        <button
          onClick={() => setActiveTab('SAVED')}
          className={`pb-3 flex items-center gap-1.5 transition border-b-2 ${
            activeTab === 'SAVED' ? 'border-brand-600 text-brand-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Events
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      ) : events.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found in this Category</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You haven't joined or saved any events under this filter yet. Explore upcoming competitions and hackathons to get started.
          </p>
          <Button onClick={() => navigate('/events')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Events & Hackathons
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
