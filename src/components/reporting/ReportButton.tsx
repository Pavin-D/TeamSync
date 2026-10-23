import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Flag } from 'lucide-react';
import { ReportModal } from './ReportModal';
import { ReportEntityType } from '@/services/api/reportService';
import { useAuth } from '@/context/AuthContext';

export interface ReportButtonProps {
  entityType: ReportEntityType;
  entityId: string;
  entityName: string;
  targetUserId?: string;
  variant?: 'outline' | 'danger' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  entityType,
  entityId,
  entityName,
  targetUserId,
  variant = 'outline',
  size = 'sm',
  label,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Prevent users from reporting themselves
  if (targetUserId && user && user.id === targetUserId) {
    return null;
  }

  const defaultLabel =
    label ||
    (entityType === 'USER'
      ? 'Report User'
      : entityType === 'TEAM'
      ? 'Report Team'
      : entityType === 'MENTOR'
      ? 'Report Mentor'
      : 'Report Member');

  return (
    <>
      <Button
        variant={variant as any}
        size={size}
        onClick={() => setIsModalOpen(true)}
        leftIcon={<Flag className="w-3.5 h-3.5 text-rose-500" />}
        className="border-rose-200 text-rose-700 hover:bg-rose-50"
      >
        {defaultLabel}
      </Button>

      {isModalOpen && (
        <ReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          entityType={entityType}
          entityId={entityId}
          entityName={entityName}
          targetUserId={targetUserId}
        />
      )}
    </>
  );
};
