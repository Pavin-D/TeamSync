import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Textarea, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { UserPlus, Sparkles } from 'lucide-react';

export interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onSubmit: (message: string, skills: string[]) => Promise<void>;
}

export const JoinRequestModal: React.FC<JoinRequestModalProps> = ({
  isOpen,
  onClose,
  teamName,
  onSubmit,
}) => {
  const [message, setMessage] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(message, selectedSkills);
      onClose();
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request to Join ${teamName}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-800 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <span>
            Introduce yourself to the Team Lead! Share your relevant technical experience and why you are interested in this project.
          </span>
        </div>

        <Textarea
          label="Why would you be a good fit? *"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="I have experience building React & Node.js web applications and would love to collaborate on this problem statement..."
          rows={4}
          required
        />

        <MultiSelect
          label="Select Relevant Skills to Highlight"
          options={[
            { value: 'React', label: 'React' },
            { value: 'TypeScript', label: 'TypeScript' },
            { value: 'Python', label: 'Python' },
            { value: 'Node.js', label: 'Node.js' },
            { value: 'Machine Learning', label: 'Machine Learning' },
            { value: 'UI/UX Design', label: 'UI/UX Design' },
            { value: 'PostgreSQL', label: 'PostgreSQL' },
          ]}
          value={selectedSkills}
          onChange={setSelectedSkills}
        />

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <Button type="submit" isLoading={isSubmitting} leftIcon={<UserPlus className="w-4 h-4" />}>
            Send Join Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};
