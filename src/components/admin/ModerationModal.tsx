import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Textarea, Select } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { ShieldAlert } from 'lucide-react';

export interface ModerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionType: 'SUSPEND' | 'DELETE' | 'DISBAND' | 'RESTRICT';
  targetName: string;
  onConfirm: (reason: string, durationDays?: number) => Promise<void>;
}

export const ModerationModal: React.FC<ModerationModalProps> = ({
  isOpen,
  onClose,
  title,
  actionType,
  targetName,
  onConfirm,
}) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('7');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onConfirm(reason, parseInt(duration, 10));
      onClose();
    } catch {
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-950 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            You are performing a <strong>{actionType}</strong> administrative action on <strong>{targetName}</strong>. This operation will be logged in the immutable audit registry.
          </span>
        </div>

        <Textarea
          label="Mandatory Reason for Action *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="State the official policy or report reference justifying this action..."
          rows={3}
          required
        />

        {actionType === 'SUSPEND' && (
          <Select
            label="Suspension Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            options={[
              { value: '7', label: '7 Days Suspension' },
              { value: '14', label: '14 Days Suspension' },
              { value: '30', label: '30 Days Suspension' },
              { value: '90', label: '90 Days Suspension' },
            ]}
          />
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <SecondaryButton type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </SecondaryButton>
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            Confirm {actionType}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
