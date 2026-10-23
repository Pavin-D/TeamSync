import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminEvent } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { EventTable } from '@/components/admin/EventTable';
import { TextInput, Select, Textarea } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Calendar, Plus, ExternalLink } from 'lucide-react';

export const AdminEventsPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<AdminEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'ACTIVE',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getEvents();
      if (res.success && res.data) {
        setEvents(res.data);
      } else {
        setEvents([]);
      }
    } catch {
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.createEvent(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        setFormData({ title: '', description: '', status: 'ACTIVE' });
        fetchEvents();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEvent) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.updateEvent(editEvent.id, formData);
      if (res.success) {
        setEditEvent(null);
        fetchEvents();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (evt: AdminEvent) => {
    if (window.confirm(`Are you sure you want to delete event "${evt.title}"?`)) {
      try {
        await adminService.deleteEvent(evt.id);
        fetchEvents();
      } catch {
        fetchEvents();
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Event & Challenge Management</h1>
              <p className="text-xs text-slate-500">Overview and control of all active hackathons, innovation challenges, and competitions</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setFormData({ title: '', description: '', status: 'ACTIVE' });
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create New Event
          </Button>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="table" count={3} />
        ) : events.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Events Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No hackathon events are currently created in the platform database. Click "Create New Event" to publish one.
            </p>
          </div>
        ) : (
          <EventTable
            events={events}
            onView={(e) => setViewingEvent(e)}
            onEdit={(e) => {
              setEditEvent(e);
              setFormData({ title: e.title, description: '', status: e.status });
            }}
            onDelete={handleDeleteEvent}
          />
        )}
      </main>

      {/* View Event Modal */}
      {viewingEvent && (
        <Modal isOpen={!!viewingEvent} onClose={() => setViewingEvent(null)} title={`Event Details: ${viewingEvent.title}`}>
          <div className="space-y-4 text-left p-1 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Organizer</span>
                <span className="font-bold text-slate-900">{viewingEvent.organizer || 'Platform Admin'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Event Status</span>
                <span className="font-bold text-brand-600 uppercase">{viewingEvent.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Date</span>
                <span className="font-mono text-slate-700">{viewingEvent.date || 'Active Event'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Total Participants</span>
                <span className="font-bold text-slate-900 font-mono">{viewingEvent.participantsCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-semibold">Total Teams</span>
                <span className="font-bold text-slate-900 font-mono">{viewingEvent.teamsCount || 0}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  const id = viewingEvent.id;
                  setViewingEvent(null);
                  navigate(`/events/${id}`);
                }}
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open Full Page
              </Button>
              <Button onClick={() => setViewingEvent(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Event Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Event">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="Event Title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. National AI Innovation Hackathon 2026"
              required
            />
            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe event eligibility, prizes, and rules..."
            />
            <Select
              label="Event Status"
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'UPCOMING', label: 'Upcoming' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Publish Event
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Event Modal */}
      {editEvent && (
        <Modal isOpen={!!editEvent} onClose={() => setEditEvent(null)} title={`Edit Event: ${editEvent.title}`}>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="Event Title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Select
              label="Event Status"
              value={formData.status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'UPCOMING', label: 'Upcoming' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditEvent(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
