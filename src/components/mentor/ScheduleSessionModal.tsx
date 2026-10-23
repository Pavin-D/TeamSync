import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TextInput, Select, Textarea } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { MentorshipSession } from '@/services/api/mentorService';

export interface ScheduleSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorshipId: string;
  onSchedule: (session: Partial<MentorshipSession>) => Promise<void>;
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  isOpen,
  onClose,
  mentorshipId,
  onSchedule,
}) => {
  const [date, setDate] = useState('2026-08-15');
  const [time, setTime] = useState('18:00');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [topic, setTopic] = useState('Machine Learning Pipeline Architecture Review');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSchedule({
        mentorshipId,
        date,
        time,
        durationMinutes,
        topic,
        notes,
        status: 'SCHEDULED',
      });
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule Mentorship Session">
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-xs text-slate-500">
          Pick a date and topic for your upcoming 1-on-1 or team mentorship session.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <TextInput
            label="Time *"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <Select
          label="Session Duration *"
          value={String(durationMinutes)}
          onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
          options={[
            { value: '30', label: '30 Minutes' },
            { value: '45', label: '45 Minutes (Recommended)' },
            { value: '60', label: '60 Minutes' },
          ]}
        />

        <TextInput
          label="Session Topic *"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. ML Pipeline Review & Model Serving APIs"
          required
        />

        <Textarea
          label="Session Notes & Pre-work (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Questions or GitHub links to review prior to the session..."
          rows={3}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Calendar className="w-4 h-4" />}>
            Schedule Session
          </Button>
        </div>
      </form>
    </Modal>
  );
};
