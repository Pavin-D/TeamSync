import React, { useEffect, useState } from 'react';
import { collegeService, CollegeEventParticipation } from '@/services/api/collegeService';
import { eventService, Event } from '@/services/api/eventService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { PostHackathonModal } from '@/components/college/PostHackathonModal';
import { Card, Badge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Calendar, PlusCircle, Trash2, Globe, Building2, Building } from 'lucide-react';

export const CollegeEventsPage: React.FC = () => {
  const [participations, setParticipations] = useState<CollegeEventParticipation[]>([]);
  const [postedEvents, setPostedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const [partRes, eventsRes] = await Promise.all([
        collegeService.getCollegeEvents(),
        eventService.getEvents(),
      ]);

      if (partRes.success && partRes.data) {
        setParticipations(partRes.data);
      } else {
        setParticipations([]);
      }

      if (eventsRes.success && eventsRes.data) {
        setPostedEvents(eventsRes.data);
      } else {
        setPostedEvents([]);
      }
    } catch {
      setParticipations([]);
      setPostedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteEvent = async (eventId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete hackathon event "${title}"?`)) {
      return;
    }
    try {
      const res = await eventService.deleteEvent(eventId);
      if (res.success) {
        fetchEvents();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete hackathon event.');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Institutional Hackathons & Events</h1>
              <p className="text-xs text-slate-500">Post, manage, and delete intra-college or department-scoped hackathons for your institution</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsPostModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Post Hackathon
          </Button>
        </div>

        {/* Posted Hackathons Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Posted College Hackathons</h2>

          {isLoading ? (
            <SkeletonLoader variant="card" count={2} />
          ) : postedEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900 mb-1">No Hackathons Posted Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Post hackathons for specific departments or your whole college to invite students to participate.
              </p>
              <Button size="sm" onClick={() => setIsPostModalOpen(true)} leftIcon={<PlusCircle className="w-4 h-4" />}>
                Post Hackathon Now
              </Button>
            </div>
          ) : (
            postedEvents.map((evt) => {
              const isDeptScoped = evt.description?.includes('[DEPT_SCOPED:');
              const isIntraCollege = evt.description?.includes('[INTRA_COLLEGE:');

              let scopeBadge = (
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Globe className="w-3 h-3 text-indigo-600" /> Global Hackathon
                </span>
              );

              if (isDeptScoped) {
                const parts = evt.description.split(':');
                const deptName = parts[3]?.split(']')[0] || 'Department';
                scopeBadge = (
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Building className="w-3 h-3 text-purple-600" /> {deptName} Scoped
                  </span>
                );
              } else if (isIntraCollege) {
                scopeBadge = (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-emerald-600" /> Whole College
                  </span>
                );
              }

              return (
                <Card key={evt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                      {scopeBadge}
                      <Badge variant="primary">{evt.status}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Mode: <strong className="text-slate-700">{evt.mode}</strong> • Dates: {evt.startDate?.split('T')[0]} to {evt.endDate?.split('T')[0]}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-bold"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Delete Hackathon
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Participation Section */}
        {participations.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Student Participation Records</h2>
            <div className="space-y-3">
              {participations.map((evt) => (
                <Card key={evt.eventId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{evt.eventName || evt.eventTitle || 'Event'}</h4>
                      <Badge variant="primary">{evt.resultSummary || `${evt.winsCount || evt.wins || 0} Wins`}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Mode: <strong className="text-slate-700">{evt.mode || 'ONLINE'}</strong> • Date: {evt.date || evt.startDate?.split('T')[0] || 'Recently'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Students</span>
                      <span className="font-bold text-slate-900">{evt.studentsCount || evt.participantsCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Teams</span>
                      <span className="font-bold text-slate-900">{evt.teamsCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Wins</span>
                      <span className="font-extrabold text-amber-600">{evt.winsCount || evt.wins || 0} 🏆</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Post Hackathon Modal */}
      {isPostModalOpen && (
        <PostHackathonModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onSuccess={fetchEvents}
        />
      )}
    </div>
  );
};
