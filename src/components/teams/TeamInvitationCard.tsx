import React, { useState } from 'react';
import { TeamInvitation } from '@/services/api/teamService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Check, X, Crown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TeamInvitationCardProps {
  invitation: TeamInvitation;
  onAccept: (invitationId: string) => Promise<void>;
  onDecline: (invitationId: string) => Promise<void>;
}

export const TeamInvitationCard: React.FC<TeamInvitationCardProps> = ({
  invitation,
  onAccept,
  onDecline,
}) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusState, setStatusState] = useState(invitation.status);

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      await onAccept(invitation.id);
      setStatusState('ACCEPTED');
    } catch {
      // Handled
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    setIsProcessing(true);
    try {
      await onDecline(invitation.id);
      setStatusState('DECLINED');
    } catch {
      // Handled
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-5 text-left flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="primary">{invitation.eventName}</Badge>
          <span className="text-[11px] text-slate-400">{invitation.invitedAt}</span>
        </div>

        <h4 className="text-base font-bold text-slate-900 mb-1">{invitation.teamName}</h4>
        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1 font-medium">
          <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Invited by {invitation.invitedByName}
        </p>

        {invitation.requiredSkills && invitation.requiredSkills.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1.5">Required Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {invitation.requiredSkills.map((s) => (
                <SkillBadge key={s} skill={s} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {statusState === 'PENDING' ? (
          <>
            <SecondaryButton
              size="sm"
              onClick={() => navigate(`/teams/${invitation.teamId}`)}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              View Team
            </SecondaryButton>
            <div className="flex items-center gap-2">
              <Button size="sm" isLoading={isProcessing} onClick={handleAccept} leftIcon={<Check className="w-3.5 h-3.5" />}>
                Accept
              </Button>
              <SecondaryButton
                size="sm"
                disabled={isProcessing}
                onClick={handleDecline}
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                leftIcon={<X className="w-3.5 h-3.5" />}
              >
                Decline
              </SecondaryButton>
            </div>
          </>
        ) : (
          <div className="w-full text-right">
            <Badge variant={statusState === 'ACCEPTED' ? 'success' : 'danger'}>
              {statusState === 'ACCEPTED' ? 'Joined Team ✓' : 'Declined'}
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
};
