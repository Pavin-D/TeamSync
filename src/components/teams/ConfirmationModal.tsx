import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  onConfirm: () => Promise<void>;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  isDanger = true,
  onConfirm,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4 text-left">
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
          isDanger ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isDanger ? 'text-rose-600' : 'text-amber-600'}`} />
          <p className="leading-relaxed">{message}</p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <SecondaryButton onClick={onClose} disabled={isLoading}>
            Cancel
          </SecondaryButton>
          <Button
            isLoading={isLoading}
            onClick={handleConfirm}
            className={isDanger ? 'bg-rose-600 hover:bg-rose-700 text-white' : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
