import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select, Textarea } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { MentorshipType, MentorshipFormat, MentorshipRequestData } from '@/services/api/mentorService';
import { Users, User, Send } from 'lucide-react';

export interface MentorshipRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId: string;
  mentorName: string;
  onSubmitRequest: (data: MentorshipRequestData) => Promise<void>;
}

export const MentorshipRequestModal: React.FC<MentorshipRequestModalProps> = ({
  isOpen,
  onClose,
  mentorId,
  mentorName,
  onSubmitRequest,
}) => {
  const [mentorshipType, setMentorshipType] = useState<MentorshipType>('INDIVIDUAL');
  const [helpArea, setHelpArea] = useState('Technical Development');
  const [eventId, setEventId] = useState('evt_01');
  const [preferredFormat, setPreferredFormat] = useState<MentorshipFormat>('SHORT_TERM');
  const [preferredAvailability] = useState('Weekends');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitRequest({
        mentorId,
        mentorshipType,
        eventId: eventId || undefined,
        helpArea,
        message,
        preferredFormat,
        preferredAvailability,
      });
      onClose();
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Mentorship from ${mentorName}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <p className="text-xs text-slate-500">
          Describe your project goals and what technical or architecture guidance you need from {mentorName}.
        </p>

        {/* Individual vs Team Mentorship Toggle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-900 block">Mentorship Audience *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMentorshipType('INDIVIDUAL')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                mentorshipType === 'INDIVIDUAL'
                  ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-subtle'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-brand-600" /> Individual Student
            </button>
            <button
              type="button"
              onClick={() => setMentorshipType('TEAM')}
              className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                mentorshipType === 'TEAM'
                  ? 'bg-brand-50 border-brand-300 text-brand-700 shadow-subtle'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-brand-600" /> Entire Hackathon Team
            </button>
          </div>
        </div>

        <Select
          label="What Area Do You Need Help With? *"
          value={helpArea}
          onChange={(e) => setHelpArea(e.target.value)}
          options={[
            { value: 'Technical Development', label: 'Technical Development & Code Architecture' },
            { value: 'AI / Machine Learning', label: 'AI / Machine Learning Pipelines' },
            { value: 'System Design & APIs', label: 'System Design & API Engineering' },
            { value: 'Hackathon Strategy', label: 'Hackathon Strategy & Pitch Preparation' },
            { value: 'Career Guidance', label: 'Career Guidance & Industry Mentorship' },
          ]}
        />

        <Select
          label="Associated Event / Competition (Optional)"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          options={[
            { value: 'evt_01', label: 'AI Innovation Hackathon 2026' },
            { value: 'evt_02', label: 'Global Web3 Challenge' },
            { value: '', label: 'General / No Event Selected' },
          ]}
        />

        <Select
          label="Preferred Mentoring Format *"
          value={preferredFormat}
          onChange={(e) => setPreferredFormat(e.target.value as MentorshipFormat)}
          options={[
            { value: 'ONE_TIME', label: 'One-time Guidance Session (30-60 mins)' },
            { value: 'SHORT_TERM', label: 'Short-term Mentorship (1-4 weeks for Hackathon)' },
            { value: 'LONG_TERM', label: 'Long-term Mentorship (Ongoing guidance)' },
          ]}
        />

        <Textarea
          label="Describe What You Need Help With *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hi! Our team is building an AI healthcare assistant for the hackathon. We have React and Node.js skills, but we need guidance on designing our FastAPI & PyTorch ML server..."
          rows={4}
          required
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
